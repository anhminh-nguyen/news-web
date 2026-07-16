import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { db } from '@/lib/db'; // Import file db mình vừa tạo

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

export async function GET() {
  try {
    const subreddit = 'nextfuckinglevel';
    const feedUrl = `https://www.reddit.com/r/${subreddit}/hot.rss`;
    
    const feed = await parser.parseURL(feedUrl);

    if (!feed.items || feed.items.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        inserted: 0,
        data: [],
      });
    }

    const MAX_POSTS = 5;
    const items = feed.items.slice(0, MAX_POSTS);

    let insertedCount = 0;
    const savedPosts = [];

    // Duyệt qua từng bài viết cào được
    for (const item of items) {
      const sourceId = item.id ? item.id.split('_')[1] || item.id : Math.random().toString();
      
      // Check xem bài này đã tồn tại trong Postgres chưa
      const existingPost = await db.rawNews.findUnique({
        where: { sourceId: sourceId }
      });

      // Nếu chưa có thì mới lưu vào DB
      if (!existingPost) {
        const contentHtml = item.content || '';
        const permalink = item.link || '';

        const hasVideo = 
        contentHtml.includes('v.redd.it') || 
        permalink.includes('v.redd.it') ||
        contentHtml.includes('<video') ||
        contentHtml.includes('youtube.com') ||
        contentHtml.includes('youtu.be');

      // NẾU KHÔNG CÓ VIDEO THÌ BỎ QUA, KHÔNG LƯU VÀO DB
        if (!hasVideo) continue;


        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const match = imgRegex.exec(contentHtml);
        const mediaUrl = match ? match[1] : item.link || '';

        const newPost = await db.rawNews.create({
          data: {
            sourceId: sourceId,
            platform: 'reddit',
            subreddit: subreddit,
            originalTitle: item.title || '',
            originalContent: item.contentSnippet || '',
            mediaUrl: mediaUrl,
            permalink: item.link || '',
            status: 'PENDING',
            crawlKeyword: null,
            vietnamScore: null,
            engageScore: null,
            contentScore: null,
          }
        });
        
        savedPosts.push(newPost);
        insertedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      total_crawled: feed.items.length, 
      new_inserted: insertedCount, // Số lượng bài mới tinh vừa lưu
      data: savedPosts 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      success: false, 
      error: `Lỗi lưu DB: ${message}` 
    }, { status: 500 });
  }
}