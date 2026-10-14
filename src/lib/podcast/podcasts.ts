export function mediaUrl(id: string, quality: Quality): string {
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE;
  if (base)
    return `${base.replace(/\/$/, "")}/${id}/${quality}.${QUALITY_META[quality].ext}`;
  return `/api/audio/${id}/${quality}`;
}
