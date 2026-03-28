import { getTrendingAnime } from "@/lib/anime";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AnimeGrid } from "@/components/AnimeGrid";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const animes = await getTrendingAnime();
  
  if (!animes || animes.length === 0) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-gray-400">Failed to load trending anime. Please check API connection.</p>
      </main>
    );
  }

  // Use the top trending anime as the hero
  const heroAnime = animes[0];
  const gridAnimes = animes.slice(1);

  return (
    <main className="min-h-screen pb-12">
      <Header />
      <Hero anime={heroAnime} />
      <div className="mt-8">
        <AnimeGrid animes={gridAnimes} title="Trending Now" />
      </div>
    </main>
  );
}
