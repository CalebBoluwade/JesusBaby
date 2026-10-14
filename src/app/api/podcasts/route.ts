import { NextResponse } from "next/server";

type AppleEpisode = {
  trackId?: number;
  collectionId?: number;
  trackName?: string;
  collectionName?: string;
  artistName?: string;
  primaryGenreName?: string;
  genres?: { name: string }[];
  shortDescription?: string;
  description?: string;
  releaseDate?: string;
  trackTimeMillis?: number;
  artworkUrl600?: string;
  artworkUrl100?: string;
  episodeUrl?: string;
  previewUrl?: string;
  trackViewUrl?: string;
  feedUrl?: string;
};

const COVER_STYLES = [
  "cover-aurora",
  "cover-sun",
  "cover-blue",
  "cover-violet",
  "cover-gold",
  "cover-red",
];

export async function GET() {
  try {
    const url = new URL("https://itunes.apple.com/search");
    url.searchParams.set("term", "christian faith");
    url.searchParams.set("entity", "podcastEpisode");
    url.searchParams.set("country", "us");
    url.searchParams.set("limit", "50");

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Apple Podcasts is temporarily unavailable." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as { results?: AppleEpisode[] };
    const episodes = (data.results ?? [])
      .filter(
        (episode) =>
          episode.trackId &&
          episode.trackName &&
          episode.collectionName &&
          (episode.episodeUrl || episode.previewUrl),
      )
      .sort(
        (left, right) =>
          Date.parse(right.releaseDate ?? "") -
          Date.parse(left.releaseDate ?? ""),
      );

    const podcasts: Podcast[] = episodes.map((episode, index) => {
      const audioUrl = episode.episodeUrl ?? episode.previewUrl!;
      const releaseDate = episode.releaseDate
        ? new Date(episode.releaseDate)
        : null;
      const durationMinutes = episode.trackTimeMillis
        ? Math.max(1, Math.round(episode.trackTimeMillis / 60_000))
        : 0;
      const category =
        episode.primaryGenreName ?? episode.genres?.[0]?.name ?? "Podcasts";

      return {
        id: String(episode.trackId),
        showId: String(episode.collectionId ?? episode.collectionName),
        title: episode.collectionName!,
        episode: episode.trackName!,
        host: episode.artistName ?? episode.collectionName!,
        category,
        description:
          episode.shortDescription ??
          episode.description ??
          "Listen to the latest episode.",
        duration: durationMinutes ? `${durationMinutes} min` : "Episode",
        date: releaseDate && !Number.isNaN(releaseDate.valueOf())
          ? new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            }).format(releaseDate)
          : "Latest",
        cover: COVER_STYLES[index % COVER_STYLES.length],
        artworkUrl: episode.artworkUrl600 ?? episode.artworkUrl100,
        appleUrl: episode.trackViewUrl,
        feedUrl: episode.feedUrl,
        preview: { start: 0, length: 30 },
        audioSources: [
          {
            quality: "medium",
            label: "Apple Podcasts",
            url: audioUrl,
            mimeType: "audio/mpeg",
          },
        ],
      };
    });

    const categories = [
      "All",
      ...new Set(podcasts.map(({ category }) => category)),
    ];
    return NextResponse.json(
      { podcasts, categories, source: "Apple Podcasts" },
      { headers: { "Cache-Control": "public, max-age=900" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not load Apple Podcasts." },
      { status: 502 },
    );
  }
}