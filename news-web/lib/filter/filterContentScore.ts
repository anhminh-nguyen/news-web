import { calculateEngagementScore } from "./filterEngagement";
import { calculateVietnamScore } from "./filterVNScore";

type Crawtype = "VN"|"Global"

export function calculateContentScore(
  video: any,
  market:Crawtype,
): number {
  const vietnamScore = calculateVietnamScore(video);
  const engagementScore = calculateEngagementScore(video);

  return market === "VN"
    ? engagementScore + vietnamScore * 10
    : engagementScore;
}