import { db } from "@/lib/db";
import { crawlTikTok } from "@/lib/filter/filterCountry";
import { NextResponse } from "next/server";

export async function GET() {


  try {
    type Crawltype = "VN" | "Global"

    // const crawlPlan: Crawltype[] = [
    //   "VN",
    //   "VN",
    //   "VN",
    //   "VN",
    //   "VN",
    //   "VN",
    //   "VN",
    //   "Global",
    //   "Global",
    //   "Global",
    // ];

    // function randomCrawl<T>(items: T[]):T{
    //     return items[Math.floor((Math.random()*items.length))]
    // }

    const crawlRegion = "VN" 
    // const crawlRegion = "Global"

    const videoTiktok = await crawlTikTok(crawlRegion)

    const savedPost = [];
const savedTopics = new Set<string>();
let insertedCount = 0;

for (const video of videoTiktok) {
  const sourceId = video.id;

  if (!sourceId) {
    continue;
  }

  const existingSource =
    await db.rawNews.findUnique({
      where: {
        sourceId: String(sourceId),
      },
    });

  if (existingSource) {
    continue;
  }

  const mediaUrl =
    video.video?.playAddr ||
    video.video?.downloadAddr ||
    "";

  const videoDesc =
    video.desc ||
    video.title ||
    "TikTok Video độc lạ bốn phương";

  const newPost = await db.rawNews.create({
    data: {
      sourceId: String(sourceId),
      platform: "tiktok",
      subreddit: null,
      originalTitle: videoDesc,
      originalContent:
        `Author: ${video.author?.nickname || "Ẩn danh"}. ` +
        `Lượt xem/tim cao.`,
      mediaUrl,
      permalink:
        video.share_url ||
        `https://www.tiktok.com/@share/video/${sourceId}`,
      status: "PENDING",
      crawlKeyword: video.crawlKeyword,
      vietnamScore: video.vietnamScore,
      engageScore: video.engageScore,
      contentScore: video.contentScore,
    },
  });

  if (video.crawlKeyword) {
    savedTopics.add(video.crawlKeyword);
  }

  savedPost.push(newPost);
  insertedCount++;
}

    return NextResponse.json(
  {
    success: true,
    platform: "Tiktok",
    crawlKeywords: Array.from(savedTopics),
    total_crawled: videoTiktok.length,
    new_inserted: insertedCount,
    data: savedPost,
  },
  { status: 200 }
);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
