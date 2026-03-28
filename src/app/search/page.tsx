import { searchAnime } from "@/lib/anime";
import { Header } from "@/components/Header";
import { AnimeGrid } from "@/components/AnimeGrid";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || "";
  const results = query ? await searchAnime(query) : [];

  const popularSearches = ["Attack on Titan", "One Piece", "Demon Slayer", "Naruto", "Dragon Ball", "Bleach", "Jujutsu Kaisen", "One Punch Man"];

  return (
    <main className="min-h-screen pt-16 pb-12 bg-background">
      <Header />

      {/* Search Hero */}
      <div className="bg-[#141414] border-b border-[#23252B] py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
            {query ? (
              <>Search: <span className="text-primary">{query}</span></>
            ) : (
              "Find Your Anime"
            )}
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            {query
              ? `${results.length} result${results.length !== 1 ? "s" : ""} found`
              : "Search through thousands of anime series and movies"}
          </p>

          {/* Desktop/tablet search bar on page */}
          <form method="GET" action="/search" className="relative flex gap-3">
            <div className="relative flex-1">
              <input
                id="search-input"
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search any anime title..."
                autoComplete="off"
                className="w-full bg-[#23252B] border border-gray-700 rounded-lg py-3 px-5 pr-12 text-base focus:outline-none focus:border-primary transition-all text-white placeholder-gray-500"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-[#D95315] text-white font-black uppercase py-3 px-8 rounded-lg transition-all active:scale-95 tracking-wider text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results or empty state */}
        {query ? (
          results.length > 0 ? (
            <AnimeGrid animes={results} title={`Results for "${query}"`} />
          ) : (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
              <p className="text-gray-400 mb-8">
                We couldn&apos;t find anything for &ldquo;{query}&rdquo;. Try a different title.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {popularSearches.slice(0, 4).map((s) => (
                  <Link
                    key={s}
                    href={`/search?q=${encodeURIComponent(s)}`}
                    className="bg-[#23252B] hover:bg-primary/20 hover:text-primary text-gray-300 border border-gray-700 hover:border-primary px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )
        ) : (
          /* No query - show popular searches */
          <div className="py-8">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Popular Searches
            </h2>
            <div className="flex flex-wrap gap-3">
              {popularSearches.map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="bg-[#23252B] hover:bg-primary hover:text-white text-gray-300 border border-gray-700 hover:border-primary px-5 py-2.5 rounded-full font-bold transition-all duration-200"
                >
                  {s}
                </Link>
              ))}
            </div>

            {/* Genre quick links */}
            <h2 className="text-xl font-black text-white uppercase tracking-widest mt-12 mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Browse by Genre
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: "Action", emoji: "⚔️" },
                { name: "Romance", emoji: "💕" },
                { name: "Comedy", emoji: "😂" },
                { name: "Drama", emoji: "🎭" },
                { name: "Fantasy", emoji: "🧙" },
                { name: "Isekai", emoji: "🌀" },
                { name: "Horror", emoji: "👻" },
                { name: "Sci-Fi", emoji: "🚀" },
                { name: "Sports", emoji: "⚽" },
                { name: "Mecha", emoji: "🤖" },
                { name: "Slice of Life", emoji: "🌸" },
                { name: "Mystery", emoji: "🔍" },
              ].map(({ name, emoji }) => (
                <Link
                  key={name}
                  href={`/search?q=${encodeURIComponent(name)}`}
                  className="group bg-[#23252B] hover:bg-primary/20 hover:border-primary border border-gray-700 rounded-lg p-4 flex flex-col items-center gap-2 transition-all duration-200"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
                  <span className="text-xs font-black text-gray-300 group-hover:text-primary uppercase tracking-widest text-center">{name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
