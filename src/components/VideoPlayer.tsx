"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  streamUrl: string;
}

export function VideoPlayer({ streamUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 100,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Auto-play prevented", e));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari, which supports HLS natively
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.log("Auto-play prevented", e));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  return (
    <div className="relative aspect-video w-full bg-black rounded-sm overflow-hidden border border-[#23252B] shadow-lg">
      <video
        ref={videoRef}
        controls
        className="w-full h-full"
        poster="" // Optional: pass a poster
      />
    </div>
  );
}
