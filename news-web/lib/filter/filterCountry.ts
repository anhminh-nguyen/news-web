import { calculateContentScore } from "./filterContentScore";
import { calculateEngagementScore } from "./filterEngagement";
import { isRecentVideo } from "./filterTime";
import { calculateVietnamScore } from "./filterVNScore";

export type CrawlType = "VN" | "Global";

const vietnamKeywordGroups = {
  interesting: [
    "datos curiosos",
    "cosas que no sabías",
    "hechos interesantes",
    "curiosidades",
  ],

  knowledge: [
    "科学知识",
    "生活知识",
    "科普",
    "知识分享",
  ],

  unusual: [
    "chuyện lạ Việt Nam",
    "độc lạ Việt Nam",
    "hiện tượng lạ trong đời sống",
    "bí ẩn",
  ],

  lifestyle: [
    "ライフハック",
    "生活のコツ",
    "便利な知識",
    "日常生活",
  ],
};

const globalKeywordGroups = {
  interesting: [
    "interesting facts",
    "things you didn't know",
    "daily facts",
    "funny things in life",
  ],

  unusual: [
    "weird facts",
    "strange things",
    "unusual events",
    "caught on camera",
  ],

  discovery: [
    "amazing discoveries",
    "science facts",
    "mystery facts",
    "new discoveries",
  ],

  lifestyle: [
    "interesting things in life",
    "unusual daily life",
    "amazing life moments",
    "unexpected moments",
  ],
};

const MAX_VIDEO_AGE_DAYS = 90;
const MAX_RESULTS = 30;
const REQUEST_DELAY_MS = 1200;

function randomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("Keyword group is empty");
  }

  return items[Math.floor(Math.random() * items.length)];
}

function getKeywords(market: CrawlType): string[] {
  const groups =
    market === "VN"
      ? vietnamKeywordGroups
      : globalKeywordGroups;

  return Object.values(groups).map((group) =>
    randomItem(group)
  );
}

function getVideoId(video: any): string | null {
  const id =
    video?.id ??
    video?.aweme_id ??
    video?.video_id ??
    video?.video?.id ??
    null;

  return id ? String(id) : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchVideosByKeyword(
  keyword: string,
  apiKey: string
): Promise<any[]> {
  const params = new URLSearchParams({
    keyword,
    cursor: "0",
    search_id: "0",
  });

  const url =
    `https://tiktok-api23.p.rapidapi.com/api/search/video?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "tiktok-api23.p.rapidapi.com",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `TikTok API failed for "${keyword}": ` +
      `${response.status} ${errorBody}`
    );
  }

  const data = await response.json();

  const videos =
    data?.item_list ??
    data?.data?.videos ??
    data?.data ??
    [];

  if (!Array.isArray(videos)) {
    console.warn(
      `Unexpected TikTok response for "${keyword}"`
    );

    return [];
  }

  return videos.map((video: any) => ({
    ...video,
    crawlKeyword: keyword,
  }));
}

function removeDuplicateVideos(videos: any[]): any[] {
  const uniqueVideos = new Map<string, any>();

  for (const video of videos) {
    const videoId = getVideoId(video);

    if (!videoId) {
      continue;
    }

    if (!uniqueVideos.has(videoId)) {
      uniqueVideos.set(videoId, video);
    }
  }

  return Array.from(uniqueVideos.values());
}

export async function crawlTikTok(
  market: CrawlType
): Promise<any[]> {
  const apiKey = process.env.TIKTOK_API_KEY;

  if (!apiKey) {
    throw new Error("Missing TIKTOK_API_KEY");
  }

  const keywords = getKeywords(market);

  console.log("TikTok market:", market);
  console.log("TikTok keywords:", keywords);

  const allVideos: any[] = [];

  for (let index = 0; index < keywords.length; index++) {
    const keyword = keywords[index];

    try {
      const videos = await fetchVideosByKeyword(
        keyword,
        apiKey
      );

      console.log(
        `"${keyword}" returned ${videos.length} videos`
      );

      allVideos.push(...videos);
    } catch (error) {
      console.error(
        `Failed keyword "${keyword}":`,
        error
      );
    }

    /*
     * Không cần chờ sau keyword cuối cùng.
     */
    if (index < keywords.length - 1) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  const uniqueVideos =
    removeDuplicateVideos(allVideos);

  const filteredVideos = uniqueVideos
    .filter((video: any) =>
      isRecentVideo(video, MAX_VIDEO_AGE_DAYS)
    )
    .map((video: any) => {
      const vietnamScore =
        calculateVietnamScore(video);

      const engageScore =
        calculateEngagementScore(video);

      const contentScore =
        calculateContentScore(video, market);

      return {
        ...video,
        crawlMarket: market,
        vietnamScore,
        engageScore: Number(
          engageScore.toFixed(2)
        ),
        contentScore: Number(
          contentScore.toFixed(2)
        ),
      };
    })
    .filter((video: any) => {
      if (market === "VN") {
        return video.vietnamScore >= 3;
      }

      return true;
    })
    .sort(
      (a: any, b: any) =>
        b.contentScore - a.contentScore
    )
    .slice(0, MAX_RESULTS);

  console.log("Total from API:", allVideos.length);
  console.log(
    "After duplicate removal:",
    uniqueVideos.length
  );
  console.log(
    "After score/time filtering:",
    filteredVideos.length
  );

  return filteredVideos;
}