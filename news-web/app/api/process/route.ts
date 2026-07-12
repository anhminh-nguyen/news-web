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
      description: "Tiêu đề video ngắn giật gân, cuốn hút Gen Z bằng tiếng Việt.",
    },
    voiceover_text: {
      type: Type.STRING,
      description: "Nội dung lời thoại toàn bộ video bằng tiếng Việt. Dưới 150 từ.",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Mảng chứa 4-5 hashtag trending",
    },
    visual_storyboard: {
      type: Type.ARRAY,
      description: "Mảng chứa các phân cảnh hình ảnh và hiệu ứng tương ứng với lời thoại.",
      items: {
        type: Type.OBJECT,
        properties: {
          start_time: {
            type: Type.NUMBER,
            description: "Thời gian bắt đầu phân cảnh này trong video (tính bằng giây, ví dụ: 0.0)"
          },
          end_time: {
            type: Type.NUMBER,
            description: "Thời gian kết thúc phân cảnh này trong video (tính bằng giây, ví dụ: 3.5)"
          },
          subtitle_segment: {
            type: Type.STRING,
            description: "Đoạn text ngắn trích từ voiceover_text để hiển thị làm sub cho riêng phân cảnh này."
          },
          visual_effect: {
            type: Type.STRING,
            description: "Hiệu ứng hình ảnh đề xuất. Chọn 1 trong: 'normal', 'zoom_in', 'zoom_out', 'pan_left', 'pan_right'."
          },
          text_style: {
            type: Type.STRING,
            description: "Phong cách màu sắc chữ. Chọn 1 trong: 'normal_white', 'highlight_yellow', 'alert_red'."
          },
          sound_effect: {
            type: Type.STRING,
            description: "Âm thanh hiệu ứng chèn vào đầu phân cảnh. Chọn 1 trong: 'none', 'whoosh', 'ding', 'pop', 'vine_boom'."
          }
        },
        required: [
          "start_time", 
          "end_time", 
          "subtitle_segment", 
          "visual_effect", 
          "text_style", 
          "sound_effect"
        ]
      }
    }
  },
  required: ["title_vietnamese", "voiceover_text", "hashtags", "visual_storyboard"],
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
  Bạn là một chuyên gia biên tập video ngắn lão luyện trên TikTok, chuyên trị thể loại chuyện lạ bốn phương, tin tức giật gân dành cho giới trẻ Gen Z Việt Nam.
  
  Nhiệm vụ của bạn:
  1. Xem file video được đính kèm (nếu có) kết hợp với tiêu đề gốc [TIÊU ĐỀ GỐC: ${pendingNews.originalTitle}] để viết lại kịch bản lời thoại (voiceover_text) bằng tiếng Việt thật bánh cuốn, bắt trend, giật gân dưới 150 từ.
  
  2. Lên ý tưởng dựng video chi tiết (visual_storyboard): 
     - Hãy chia nhỏ voiceover_text thành từng phân cảnh ngắn (mỗi cảnh tầm 2 đến 4 giây).
     - Tính toán logic thời gian [start_time] và [end_time] cho từng cảnh sao cho khớp với tốc độ đọc bình thường (khoảng 3 từ mỗi giây). Đảm bảo cảnh đầu tiên bắt đầu từ 0.0 và tổng thời gian các cảnh phải khớp với toàn bộ độ dài của bài voiceover_text.
     - Lựa chọn hiệu ứng hình ảnh (visual_effect), phong cách chữ (text_style) và âm thanh hiệu ứng (sound_effect) phù hợp với diễn biến tâm lý hoặc nội dung giật gân tại thời điểm đó của video để giữ chân người xem (retention rate) cao nhất.
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
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error("Lỗi dọn dẹp file tạm:", cleanupError);
      }
    }
  }
}

