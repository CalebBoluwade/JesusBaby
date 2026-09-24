"use client";

export default function ShareButton() {
  const handleShare = async () => {
    if (!navigator.share) {
      alert("Sharing not supported on this browser.");
      return;
    }

    try {
      await navigator.share({
        title: "Deliverance Testimonies",
        text: "Jesus is changing lives — read powerful testimonies!",
        url: window.location.href,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <button onClick={handleShare} className="px-4 py-2 bg-blue-600 text-white rounded">
      Share
    </button>
  );
}