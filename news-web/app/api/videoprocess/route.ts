import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path"



export async function GET(){
    try {
      console.log(
        "Đang kích nổ Microservice Python để render video hoàn chỉnh...",
      );

      const packedNews = (await db.rawNews.findFirst({
        where: {
            status: 'PACKED',
        },
        select:{
            videoDir : true,
        }
      }));

      if(!packedNews?.videoDir){
        throw new Error("Không tìm thấy thư mục video từ bản tin");
      }

      const absoluteVideoDir = path.join(process.cwd(),packedNews.videoDir) || '';
      
      const pythonResponse = await fetch("http://localhost:8000/render", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          video_dir: absoluteVideoDir,
        }),
      });

      if (!pythonResponse.ok) {
        const errDetail = await pythonResponse.text();
        throw new Error(`Server Python báo lỗi: ${errDetail}`);
      } else {
        const pythonResult = await pythonResponse.json();
        console.log("Thành quả từ Python:", pythonResult);

        return NextResponse.json({success:true, message:"Đã tạo video thành công từ Python"})


      }
    } catch (error) {
      console.log("Lỗi trong quá trình gọi Python");
      return NextResponse.json(
        {
          success: false,
          error: `Lỗi kết nối render video: ${error instanceof Error ? error.message : String(error)}`,
        },
        { status: 500 },
      );
    }

}