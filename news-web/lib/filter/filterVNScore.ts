const vietnamSignals = [
  "việt nam",
  "vietnam",
  "sài gòn",
  "saigon",
  "hà nội",
  "đà nẵng",
  "cần thơ",
  "miền tây",
  "người việt",
  "chuyện lạ",
  "có thể bạn chưa biết",
  "độc lạ",
  "kiến thức",
];

function normalizeText(value: unknown): string {
  return String(value ?? "").toLowerCase().trim();
}

export function calculateVietnamScore(video: any): number {
  const description = normalizeText(
    video.description ??
    video.desc ??
    video.title ??
    video.video_description
  );

  const authorRegion = normalizeText(
    video.author?.region ??
    video.author?.region_code ??
    video.region ??
    video.region_code
  );

  const hashtags = Array.isArray(video.hashtags)
    ? video.hashtags.map(normalizeText).join(" ")
    : "";

  const searchableText = `${description} ${hashtags}`;

  let score = 0;

  if (authorRegion === "vn") {
    score += 5;
  }

  for (const signal of vietnamSignals) {
    if (searchableText.includes(signal)) {
      score += 1;
    }
  }

  // Có nhiều ký tự tiếng Việt có dấu.
  if (/[ăâđêôơưàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵ]/i.test(description)) {
    score += 4;
  }

  return score;
}