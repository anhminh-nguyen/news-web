export function isRecentVideo(video:any, maximumAgeDays = 30): boolean {
  const timestamp = Number(
    video.createTime ??
    video.create_time ??
    video.createdAt ??
    0
  );

  if (!timestamp) return false;

  const createdAt = new Date(
    timestamp < 10_000_000_000
      ? timestamp * 1000
      : timestamp
  );

  const ageMs = Date.now() - createdAt.getTime();
  const maximumAgeMs = maximumAgeDays * 24 * 60 * 60 * 1000;

  return ageMs >= 0 && ageMs <= maximumAgeMs;
}