import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";
import os from "os";

const gglClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

// ========================================================
// BƯỚC 1 SCHEMA: Chỉ lấy Tiêu đề, Voiceover chữ dài và Hashtag
// ========================================================
const step1Schema = {
  type: Type.OBJECT,
  properties: {
    title_vietnamese: {
      type: Type.STRING,
      description: "Tiêu đề video ngắn giật gân hoặc cuốn hút Gen Z bằng tiếng Việt.",
    },
    voiceover_text: {
      type: Type.STRING,
      description: "Nội dung lời thoại toàn bộ video bằng tiếng Việt. BẮT BUỘC viết cực kỳ chi tiết, diễn giải đầy đủ các tình tiết trong video. Độ dài bắt buộc phải từ 250 đến 270 từ để khi đọc lên khớp vừa vặn với thời lượng 90 giây của video gốc. TUYỆT ĐỐI không tóm tắt sơ sài.",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Mảng chứa 4-5 hashtag trending",
    },
  },
  required: ["title_vietnamese", "voiceover_text", "hashtags"],
};

// ========================================================
// BƯỚC 2 SCHEMA: Chỉ tập trung băm nhỏ Timeline và chèn SFX
// ========================================================
const step2Schema = {
  type: Type.OBJECT,
  properties: {
    visual_storyboard: {
      type: Type.ARRAY,
      description: "Mảng chứa các phân cảnh hình ảnh và hiệu ứng tương ứng, băm nhỏ từ chính xác đoạn voiceover_text được cung cấp ở Bước 1.",
      items: {
        type: Type.OBJECT,
        properties: {
          start_time: {
            type: Type.NUMBER,
            description: "Thời gian bắt đầu phân cảnh này trong video (tính bằng giây, ví dụ: 0.0)"
          },
          end_time: {
            type: Type.NUMBER,
            description: "Thời gian kết thúc phân cảnh này trong video (tính bằng giây, ví dụ: 3.5). Đảm bảo cảnh cuối cùng kết thúc ở chính xác thời lượng video gốc (90.0)."
          },
          subtitle_segment: {
            type: Type.STRING,
            description: "Đoạn text ngắn trích NGUYÊN VĂN từ voiceover_text để hiển thị làm sub cho riêng phân cảnh này."
          },
          visual_effect: {
            type: Type.STRING,
            description: "Hiệu ứng hình ảnh đề xuất. Chọn 1 trong: 'normal', 'zoom_in', 'zoom_out', 'pan_left', 'pan_right', 'zoom_in_right','zoom_in_left','pan_down', 'pan_up'."
          },
          text_style: {
            type: Type.STRING,
            description: 'normal_white',     
          },
          sound_effect: {
            type: Type.STRING,
            description: `
              Chọn 1 trong:
              'none',
              'whoosh',
              'pop',
              'ding',
              'click',
              'notification',
              'camera_shutter',
              'wow',
              'chime',
              `
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
  required: ["visual_storyboard"],
};

export async function GET() {
  let tempFilePath = "";
  let uploadResult = null;

  try {
    // 1. Lấy ra 1 bài viết READY từ DB
    const pendingNews = await db.rawNews.findFirst({
      where: {
        status: "READY",
        platform: "tiktok",
      },
      orderBy: { createdAt: "asc" },
    });

    if (!pendingNews) {
      return NextResponse.json({
        success: false,
        error: "Hết tin để xử lý rồi nhé!",
      });
    }

    const videoDuration = 90; // Thời lượng video gốc bạn đã biết trước là 90s
    const contents = [];

    // 2. TỐI ƯU MULTIMODAL: Tải video về thư mục tạm và upload lên Google File API
    if (
      pendingNews.mediaUrl &&
      pendingNews.mediaUrl.startsWith("http") &&
      pendingNews.platform === "tiktok"
    ) {
      try {
        const mediaResponse = await fetch(pendingNews.mediaUrl);
        if (mediaResponse.ok) {
          const buffer = await mediaResponse.arrayBuffer();

          const fileBuffer = fs.readFileSync(tempFilePath);
          const fileBlob = new Blob([fileBuffer], { type: "video/mp4" });

          console.log("Đang upload trực tiếp video từ bộ nhớ RAM lên Google File API...");

          fs.writeFileSync(tempFilePath, Buffer.from(buffer));

          uploadResult = await gglClient.files.upload({
            file: fileBlob as any,
            config: { mimeType: "video/mp4" },
          });

          console.log(`Đã upload file lên Google, đang chờ xử lý: ${uploadResult.name}`);

          if (!uploadResult.name) {
            throw new Error("Upload thành công nhưng không nhận được file name");
          }

          let fileState = await gglClient.files.get({ name: uploadResult.name });
          while (fileState.state === "PROCESSING") {
            console.log("Video đang được Google bóc tách frame... chờ 2 giây...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            fileState = await gglClient.files.get({ name: uploadResult.name });
          }

          if (fileState.state === "FAILED") {
            throw new Error("Google xử lý video thất bại rồi ông ơi!");
          }

          console.log("Video đã sẵn sàng (ACTIVE)! Tiến hành gửi cho AI...");

          contents.push({
            fileData: {
              fileUri: uploadResult.uri,
              mimeType: uploadResult.mimeType,
            },
          });
        }
      } catch (uploadError) {
        console.error("Lỗi upload File API, chuyển sang chạy text thuần:", uploadError);
      }
    }

    // ========================================================
    // 🔥 LƯỢT 1: BẮT AI XEM VIDEO & TIÊU ĐỀ ĐỂ VIẾT KỊCH BẢN CHỮ DÀI
    // ========================================================
    console.log("🚀 [BƯỚC 1]: Đang ép Gemini viết kịch bản chữ đầy đủ...");
    
    const promptStep1 = `
      Bạn là một chuyên gia biên tập video ngắn lão luyện trên TikTok, chuyên trị thể loại chuyện lạ bốn phương, tin tức giật gân, drama dành cho giới trẻ Gen Z Việt Nam.
      
      Nhiệm vụ của bạn:
      Xem file video được đính kèm (nếu có) kết hợp với tiêu đề gốc [TIÊU ĐỀ GỐC: ${pendingNews.originalTitle}] để viết lại kịch bản lời thoại (voiceover_text) bằng tiếng Việt thật bánh cuốn, bắt trend, giật gân nhưng không thiếu nội dung.
      
      QUY ĐỊNH BẮT BUỘC:
      Video gốc có thời lượng chính xác là ${videoDuration} giây. Để khớp thời gian với tốc độ đọc bình thường (~3 từ/giây), đoạn văn bản 'voiceover_text' của bạn BẮT BUỘC phải dài trong khoảng từ 250 đến 270 từ. Hãy viết thật chi tiết diễn biến, kể câu chuyện đầy đủ từ đầu đến cuối, tuyệt đối không được tóm tắt ngắn ngủi.
    `;
    
    // Copy mảng contents chứa video (nếu có) để truyền vào Lượt 1
    const step1Contents = [...contents, promptStep1];

    const step1Response = await gglClient.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: step1Contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: step1Schema,
        temperature: 0.7,
      },
    });

    if (!step1Response.text) {
      throw new Error("Gemini sập ở Bước 1, không trả về text kịch bản");
    }

    const step1Result = JSON.parse(step1Response.text);
    console.log(`📝 Đã có kịch bản chữ. Số từ đếm được: ${step1Result.voiceover_text.split(" ").length}`);

    // ========================================================
    // 🔥 LƯỢT 2: ĐƯA KỊCH BẢN CHỮ VÀO ĐỂ BĂM TIMELINE VÀ HÌNH ẢNH
    // ========================================================
    console.log("🚀 [BƯỚC 2]: Đang gửi kịch bản chữ sang để băm nhỏ timeline...");

    const promptStep2 = `
      Bạn là chuyên gia thiết kế timeline và hiệu ứng hình ảnh/âm thanh cho video TikTok short-form.
      
      Dưới đây là kịch bản lời thoại tiếng Việt đầy đủ dài đúng ${videoDuration} giây vừa được soạn thảo:
      ---
      ${step1Result.voiceover_text}
      ---
      
      Nhiệm vụ của bạn:
      Lên ý tưởng dựng video chi tiết (visual_storyboard) dựa TRÊN CHÍNH XÁC đoạn kịch bản chữ ở trên:
      1. Hãy băm nhỏ toàn bộ đoạn voiceover_text trên thành từng phân cảnh ngắn (mỗi cảnh tầm 2 đến 4 giây).
      2. Tính toán logic thời gian [start_time] và [end_time] cho từng cảnh sao cho khớp với tốc độ đọc (khoảng 3 từ mỗi giây). Đảm bảo cảnh đầu tiên bắt đầu từ 0.0 và tổng thời gian (end_time của phân cảnh cuối cùng) phải kết thúc ở chính xác ${videoDuration}.0 giây.
      3. Lựa chọn hiệu ứng hình ảnh (visual_effect), phong cách chữ (text_style) và âm thanh hiệu ứng (sound_effect) phù hợp với diễn biến kịch tính hoặc rùng rợn tại thời điểm đó của câu chữ để tối ưu giữ chân người xem.
    `;

    // Lượt 2 không cần truyền lại file video nữa, chỉ cần text kịch bản để băm logic
    const step2Response = await gglClient.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [promptStep2],
      config: {
        responseMimeType: "application/json",
        responseSchema: step2Schema,
        temperature: 0.3, // Hạ thấp temp để AI tính toán logic thời gian chính xác hơn
      },
    });

    if (!step2Response.text) {
      throw new Error("Gemini sập ở Bước 2, không băm được timeline");
    }

    const step2Result = JSON.parse(step2Response.text);
    console.log(`⏱️ Đã băm xong timeline JSON. Số phân cảnh: ${step2Result.visual_storyboard.length}`);

    // ========================================================
    // 📊 GỘP 2 KẾT QUẢ THÀNH 1 ĐỐI TƯỢNG DUY NHẤT NHƯ CŨ
    // ========================================================
    const finalGeneratedScript = {
      title_vietnamese: step1Result.title_vietnamese,
      voiceover_text: step1Result.voiceover_text,
      hashtags: step1Result.hashtags,
      visual_storyboard: step2Result.visual_storyboard,
    };

    // 6. Cập nhật trạng thái thành PROCESSED vào DB
    await db.rawNews.update({
      where: { id: pendingNews.id },
      data: {
        status: "PROCESSED",
        processedScript: JSON.stringify(finalGeneratedScript),
      },
    });

    return NextResponse.json({
      success: true,
      news_id: pendingNews.id,
      platform_source: pendingNews.platform,
      media_url: pendingNews.mediaUrl,
      script: finalGeneratedScript,
    });

  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Lỗi xử lý: ${message}` },
      { status: 500 },
    );

  } finally {
    // Luôn dọn dẹp file tạm trên hệ thống tránh tràn ổ cứng server
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error("Lỗi dọn dẹp file tạm:", cleanupError);
      }
    }
  }
}