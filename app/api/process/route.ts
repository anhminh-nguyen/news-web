import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";
import os from "os";

const gglClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

export async function GET() {
  let tempFilePath = "";
  let uploadResult = null;

  try {
    // 1. Lấy ra 1 bài viết PENDING từ DB
    const pendingNews = await db.rawNews.findFirst({
      where: {
        status: "PENDING",
        platform: "tiktok",
      },
      orderBy: { createdAt: "asc" },
    });

    if (!pendingNews) {
      return NextResponse.json({
        success: false,
        error: "Hết tin để xử lý rồi ông ơi!",
      });
    }

    // 2. Cấu trúc JSON đầu ra cho kịch bản
    const scriptSchema = {
      type: Type.OBJECT,
      properties: {
        title_vietnamese: {
          type: Type.STRING,
          description:
            "Tiêu đề video ngắn giật gân, cuốn hút Gen Z bằng tiếng Việt.",
        },
        voiceover_text: {
          type: Type.STRING,
          description:
            "Nội dung lời thoại tiếng Việt lồng tiếng. Nghe/xem video gốc để dịch và viết lại thật bánh cuốn, bắt trend. Dưới 150 từ.",
        },
        hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Mảng chứa 4-5 hashtag trending",
        },
      },
      required: ["title_vietnamese", "voiceover_text", "hashtags"],
    };

    const contents = [];

    // 3. TỐI ƯU MULTIMODAL: Tải video về thư mục tạm và upload lên Google File API
    if (
      pendingNews.mediaUrl &&
      pendingNews.mediaUrl.startsWith("http") &&
      pendingNews.platform === "tiktok"
    ) {
      try {
        const mediaResponse = await fetch(pendingNews.mediaUrl);
        if (mediaResponse.ok) {
          const buffer = await mediaResponse.arrayBuffer();

          // Tạo file tạm trên server Next.js (lưu vào thư mục temp của hệ điều hành)
          tempFilePath = path.join(
            os.tmpdir(),
            `tiktok_${pendingNews.sourceId}.mp4`,
          );
          fs.writeFileSync(tempFilePath, Buffer.from(buffer));

          // Đẩy file video lên Google File API chuyên dụng
          uploadResult = await gglClient.files.upload({
            file: tempFilePath,
            config: {
              mimeType: "video/mp4",
            },
          });

          console.log(
            `Đã upload file lên Google, đang chờ xử lý: ${uploadResult.name}`,
          );

          // 2. VÒNG LẶP KIỂM TRA TRẠNG THÁI FILE (POLLING)

          if (!uploadResult.name) {
            throw new Error(
              "Upload thanh cong nhung khong nhan duoc file name",
            );
          }

          let fileState = await gglClient.files.get({
            name: uploadResult.name,
          });
          while (fileState.state === "PROCESSING") {
            console.log(
              "Video đang được Google bóc tách frame... chờ 2 giây...",
            );
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Chờ 2 giây rồi check lại
            fileState = await gglClient.files.get({ name: uploadResult.name });
          }

          if (fileState.state === "FAILED") {
            throw new Error("Google xử lý video thất bại rồi ông ơi!");
          }

          console.log("Video đã sẵn sàng (ACTIVE)! Tiến hành gửi cho AI...");

          // Đẩy cái URI siêu nhẹ của file vừa upload vào mảng contents cho Gemini đọc
          contents.push({
            fileData: {
              fileUri: uploadResult.uri,
              mimeType: uploadResult.mimeType,
            },
          });

          console.log(
            "Đã upload video lên Google File API thành công:",
            uploadResult.uri,
          );
        }
      } catch (uploadError) {
        console.error(
          "Lỗi upload File API, chuyển sang chạy text thuần:",
          uploadError,
        );
      }
    }

    // 4. Prompt điều khiển AI nhìn video và dịch thuật
    const promptText = `
      Bạn là một biên tập viên nội dung video ngắn chuyện lạ bốn phương dành cho giới trẻ Gen Z Việt Nam trên TikTok.
      Hãy xem file video được đính kèm (nếu có), kết hợp với tiêu đề gốc dưới đây để biên tập lại thành một kịch bản lồng tiếng tiếng Việt cực cuốn, hài hước và khớp với diễn biến video.

      TIÊU ĐỀ GỐC: ${pendingNews.originalTitle}
    `;
    contents.push(promptText);

    const response = await gglClient.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: scriptSchema,
        temperature: 0.7,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini không trả về dữ liệu");
    }

    const generatedScript = JSON.parse(responseText);

    // 6. Cập nhật trạng thái thành PROCESSED
    await db.rawNews.update({
      where: {
        id: pendingNews.id,
      },
      data: {
        status: "PROCESSED",
        processedScript: JSON.stringify(generatedScript),
      },
    });

    return NextResponse.json({
      success: true,
      news_id: pendingNews.id,
      platform_source: pendingNews.platform,
      media_url: pendingNews.mediaUrl,
      script: generatedScript,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Lỗi xử lý: ${message}` },
      { status: 500 },
    );
  } finally {
    // DỌN DẸP: Xóa file tạm trên server local sau khi chạy xong để tránh đầy ổ cứng
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error("Lỗi dọn dẹp file tạm:", cleanupError);
      }
    }
  }
}
