import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    // 1. Lấy bài viết cũ nhất đã PROCESSED
    const processedNews = await db.rawNews.findFirst({
      where: {
        status: "PROCESSED",
      },
      orderBy: { createdAt: "asc" },
    });

    if (!processedNews) {
      return NextResponse.json({
        success: false,
        error: "KO Còn cái nào hết!",
      });
    }

    const videoDir = path.join(process.cwd(), "video", processedNews.id);
    const localVideoPath = path.join(videoDir, "video_raw.mp4");
    const localScriptPath = path.join(videoDir, "script.json");
    const audioPath = path.join(videoDir, "audio.mp3");

    let scriptData = null;
    if (processedNews.processedScript) {
      try {
        scriptData = JSON.parse(processedNews.processedScript);
      } catch (error) {
        console.error("Lỗi parse json script từ DB: ", error);
      }
    }

    // 2. KIỂM TRA TỒN TẠI: Nếu cả video và script đều đã được lưu rồi thì bỏ qua không tải lại
    if (
      fs.existsSync(localVideoPath) &&
      fs.existsSync(localScriptPath) &&
      fs.existsSync(audioPath)
    ) {
      console.log(
        `Tài nguyên của ID ${processedNews.id} đã tồn tại, bỏ qua tải lại.`,
      );
      return NextResponse.json({
        success: true,
        message: "Tất cả tài nguyên đã tồn tại sẵn dưới local",
        data: processedNews,
      });
    }

    // 3. Nếu chưa có, tiến hành tạo thư mục và tải về
    if (processedNews.mediaUrl) {
      try {
        // Tạo folder nếu chưa có
        if (!fs.existsSync(videoDir)) {
          fs.mkdirSync(videoDir, { recursive: true });
        }

        // Tải và lưu Video (nếu file video chưa có)
        if (!fs.existsSync(localVideoPath)) {
          const videoResponse = await fetch(processedNews.mediaUrl);
          if (videoResponse.ok) {
            const videoBuffer = await videoResponse.arrayBuffer();
            fs.writeFileSync(localVideoPath, Buffer.from(videoBuffer));
            console.log("Đã lưu video thành công!");
          }
        }

        // Ghi file Script (SỬA LỖI Ở ĐÂY: Dùng JSON.stringify)
        if (scriptData && !fs.existsSync(localScriptPath)) {
          fs.writeFileSync(
            localScriptPath,
            JSON.stringify(processedNews.processedScript, null, 2), // Ép thành chuỗi JSON có định dạng thụt lề cho đẹp
            "utf-8",
          );
          console.log("Đã ghi file script.json thành công!");
        }
      } catch (downloadError) {
        console.log("Lỗi lưu tài nguyên local: ", downloadError);
        return NextResponse.json(
          { success: false, error: "Lỗi trong quá trình tải/lưu file" },
          { status: 500 },
        );
      }
    }

    // kết nối api google
    if (!fs.existsSync(audioPath) && scriptData?.voiceover_text) {
      try {
        console.log("Đang tiến hành chạy text-to-speech tạp mp3");

        const voiceKey = process.env.GOOGLE_VOICE_KEY || "";

        if (!voiceKey) {
          throw new Error("Add voice key ko được");
        }

        const gtsResponse = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${voiceKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: {
                text: scriptData.voiceover_text,
              },
              voice: {
                languageCode: "vi-VN",
                name: "vi-VN-Neural2-A",
              },
              audioConfig: {
                audioEncoding: "MP3",
                speakingRate: 1.0,
              },
            }),
          },
        );

        if (!gtsResponse.ok) {
          const errText = await gtsResponse.text();
          throw new Error(`Google TTS API báo lỗi: ${errText}`);
        }

        const gtsData = await gtsResponse.json();

        if (!gtsData.audioContent) {
          throw new Error("Không nhận được dữ liệu audioContent từ Google TTS");
        }

        const audioBuffer = Buffer.from(gtsData.audioContent, "base64");
        fs.writeFileSync(audioPath, audioBuffer);

        console.log("Đã tạo và lưu file audio.mp3 thành công");

        await db.rawNews.update({
            where: {
                id: processedNews.id
            },
            data: {
                status:'PACKED'
            }
        })



      } catch (ttsError) {
        console.log("Lỗi trong quá trình sinh giọng đọc TTS: ", ttsError);
        return NextResponse.json(
          {
            success: false,
            error: `Lỗi sinh giọng đọc AI: ${ttsError instanceof Error ? ttsError.message : String(ttsError)}`,
          },
          { status: 500 },
        );
      }
    }

    // Trả về kết quả thành công sau khi xử lý xong xuôi
    return NextResponse.json({
      success: true,
      message: "Đã tải và chuyển đổi thành audio thành công trong folder!",
      data: processedNews,
    });
  } catch (error) {
    console.log("Lỗi hệ thống toàn cục: ", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
