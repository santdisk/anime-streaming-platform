import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { Anime } from "@/lib/anime";

// Strip HTML tags from description
function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

export function Hero({ anime }: { anime: Anime }) {
  const bannerImage = anime.bannerImage || anime.coverImage.extraLarge;
  const description = anime.description ? stripHtml(anime.description) : "No description available.";
  const title = anime.title.english || anime.title.romaji;

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src={bannerImage} 
          alt={title} 
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="container mx-auto px-4 pb-12 md:pb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight text-white drop-shadow-md">
              {title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-8 max-w-2xl drop-shadow-md">
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href={`/watch/${anime.id}`}
                className="flex items-center gap-2 bg-primary hover:bg-[#D95315] text-white font-bold py-3 px-8 rounded-sm transition-transform active:scale-95 uppercase tracking-wider text-sm"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Watching
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
