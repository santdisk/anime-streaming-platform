import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Anime } from "@/lib/anime";

export function AnimeGrid({ animes, title }: { animes: Anime[], title: string }) {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-white pb-2 border-b border-[#23252B]">{title}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {animes.map((anime) => {
          const mainTitle = anime.title.english || anime.title.romaji;
          
          return (
            <Link 
              key={anime.id} 
              href={`/watch/${anime.id}`}
              className="group flex flex-col gap-2"
            >
              {/* Poster Container */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-[#23252B] transition-transform duration-300 group-hover:-translate-y-1">
                <Image 
                  src={anime.coverImage.extraLarge}
                  alt={mainTitle}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transition-opacity duration-300 group-hover:opacity-75"
                />
                
                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>

                {/* Orange Border Effect on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
                
                {/* Episode Badge */}
                {anime.episodes && (
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-xs font-bold text-white rounded text-shadow">
                    Ep {anime.episodes}
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-200 line-clamp-2 group-hover:text-primary transition-colors mt-1">
                  {mainTitle}
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex gap-2">
                  <span>Sub | Dub</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
