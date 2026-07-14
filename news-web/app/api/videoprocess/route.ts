import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import { Agent } from "undici";
export const runtime = "nodejs";
export const maxDuration = 1800;

const pythonAgent = new Agent({
  headersTimeout: 30 * 60 * 1000, // 30 phút
  bodyTimeout: 30 * 60 * 1000, // 30 phút
});

export async function GET() {
  try {
    console.log(
      "Đang kích nổ Microservice Python để render video hoàn chỉnh...",
    );

    // 1. Tìm bản ghi PACKED
    const packedNews = await db.rawNews.findFirst({
      where: {
        status: "PACKED",
      },
    });

    // 2. Xử lý an toàn nếu không tìm thấy bản ghi nào
    if (!packedNews) {
      return NextResponse.json(
        {
          success: false,
          message: "Không có bản tin nào ở trạng thái PACKED cần render.",
        },
        { status: 404 },
      );
    }

    if (!packedNews.videoDir) {
      return NextResponse.json(
        {
          success: false,
          message: `Bản tin ${packedNews.sourceId} không có thư mục videoDir.`,
        },
        { status: 400 },
      );
    }

    // 3. Tạo đường dẫn tuyệt đối an toàn
    const absoluteVideoDir = path.join(process.cwd(), packedNews.videoDir);

    // 4. Gọi sang Python Service (Tăng timeout nếu cần thiết)

    const pythonResponse = await fetch("http://localhost:8000/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newsId: packedNews.id,
        // các dữ liệu khác
      }),

      // Fetch của Node hỗ trợ dispatcher nhưng TypeScript chuẩn không khai báo.
      dispatcher: pythonAgent,
    } as RequestInit & { dispatcher: Agent });

    if (!pythonResponse.ok) {
      const errDetail = await pythonResponse.text();
      throw new Error(`Server Python báo lỗi: ${errDetail}`);
    }

    const pythonResult = await pythonResponse.json();
    console.log("Thành quả từ Python:", pythonResult);

    // 5. Cập nhật trạng thái thành DONE sau khi Python báo thành công
    await db.rawNews.update({
      where: {
        sourceId: packedNews.sourceId,
      },
      data: {
        status: "DONE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đang tạo video và cập nhật trạng thái thành công!",
    });
  } catch (error) {
    console.error("Lỗi trong quá trình kết nối/render video:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Lỗi kết nối render video: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
