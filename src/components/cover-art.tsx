export function CoverArt({
  podcast,
  className = "",
}: Readonly<{
  podcast: Podcast;
  className?: string;
}>) {
  const words: Record<string, string> = {
    signal: "THE<br />SIGNAL",
    offscript: "OFF<br />SCRIPT",
    deepwork: "DEEP<br />WORK",
    softfocus: "SOFT<br />FOCUS",
    goodquestion: "GOOD<br />QUESTION",
    afterhours: "AFTER<br />HOURS",
  };
  return (
    <div
      className={`cover ${podcast.cover} ${className}`}
      aria-label={`${podcast.title} cover art`}
      role="img"
    >
      {podcast.artworkUrl ? (
        <img
          src={podcast.artworkUrl}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div className="art-shape" />
          <div
            className="cover-word"
            dangerouslySetInnerHTML={{
              __html: words[podcast.id] ?? podcast.title,
            }}
          />
          <div className="cover-tag">JesusBabyPod ORIGINAL</div>
        </>
      )}
    </div>
  );
}
