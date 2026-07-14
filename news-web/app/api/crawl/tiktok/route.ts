import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    const keyword = 'facts';
  const url =
    `https://tiktok-api23.p.rapidapi.com/api/search/video?keyword=${encodeURIComponent(keyword)}&cursor=0&search_id=0`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key":  process.env.TIKTOK_API_KEY ||  "0176e02a46msha841a135c0fede3p146ffejsn9aa43d19dfed",
      "x-rapidapi-host": "tiktok-api23.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, options);

    let intertedCount = 0;
    const savedPost = [];

    if (!response.ok){
        throw new Error(`RapidAPI TikTok trả về status: ${response.status}`)
    }


    const resData = await response.json();

    const videoTiktok = resData.item_list || [];

    

    for (const video of videoTiktok){
        const sourceId = video.id;
        if (!sourceId) continue 
    

    const existingSource = await db.rawNews.findUnique({
        where: {sourceId: String(sourceId)}
    });

    if(!existingSource){
        const mediaUrl = video.video?.playAddr || video.video?.downloadAddr || ''
        const videoDesc = video.desc || video.title || 'TikTok Video độc lạ bốn phương';

        const newPost = await db.rawNews.create({
            data:{
            sourceId: String(sourceId),
            platform: 'tiktok',
            subreddit: null, // TikTok không có subreddit
            originalTitle: videoDesc, // Lấy caption làm title gốc
            originalContent: `Author: ${video.author?.nickname || 'Ẩn danh'}. Lượt xem/tim cao.`,
            mediaUrl: mediaUrl, // Đường dẫn file .mp4 thô để tải về dựng video
            permalink: video.share_url || `https://www.tiktok.com/@share/video/${sourceId}`,
            status: 'PENDING'
            }
        });

        savedPost.push(newPost);
        intertedCount++;
    }
    }

    return NextResponse.json({
        success:true,
        platform:'Tiktok',
        total_crawled:videoTiktok.length,
        new_inserted: intertedCount,
        data: savedPost
    },
    {status:200}

);
    
  } catch (error) {
     const message = error instanceof Error ? error.message : String(error);
     return NextResponse.json({success:false,
        error:message
     },{status:500}
    )
  }
}
