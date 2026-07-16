export function calculateEngagementScore(video: any): number {
  const views = Number(
    video.stats?.playCount ??
    video.stats?.viewCount ??
    video.play_count ??
    video.view_count ??
    0
  );

  const likes = Number(
    video.stats?.diggCount ??
    video.stats?.likeCount ??
    video.like_count ??
    0
  );

  const comments = Number(
    video.stats?.commentCount ??
    video.comment_count ??
    0
  );

  const shares = Number(
    video.stats?.shareCount ??
    video.share_count ??
    0
  );

  if (views <= 0) return 0;

  const engagementRate =
    (likes + comments * 2 + shares * 4) / views;

  const viewScore = Math.log10(views + 1) * 10;
  const engagementScore = engagementRate * 1000;

  return viewScore + engagementScore;
}