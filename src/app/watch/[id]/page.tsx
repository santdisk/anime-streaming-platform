import { getAnimeInfoAniList, getAnimeEpisodes, getEpisodeStreamingLinks } from "@/lib/anime";
import { Header } from "@/components/Header";
import { VideoPlayer } from "@/components/VideoPlayer";
import Image from "next/image";
import Link from "next/link";

// Server Component to display details and video player
export default async function WatchPage({ 
  params,
  searchParams,
}: { 
  params: { id: string };
  searchParams: { ep?: string };
}) {
  const animeId = params.id;
  const animeInfo = await getAnimeInfoAniList(animeId);
  const episodesData = await getAnimeEpisodes(animeId);
  
  // getAnimeEpisodes returns the episodes array directly due to data?.episodes
  const episodes: Array<{ episodeId: string; episodeNo: number; name: string; filler: boolean }> = Array.isArray(episodesData) ? episodesData : episodesData?.episodes || [];
  
  // Default to first episode if not specified
  const episodeId = searchParams?.ep || (episodes.length > 0 ? episodes[0].episodeId : null);
  
  let streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"; // default placeholder
  if (episodeId) {
    const streamData = await getEpisodeStreamingLinks(episodeId);
    if (streamData && streamData.sources && streamData.sources.length > 0) {
      streamUrl = streamData.sources[0].url; // Find the first valid stream source
    }
  }

  if (!animeInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Anime not found.
      </div>
    );
  }

  // Next steps: Integrate Consumet API reliably for episodes.
  // Because Consumet endpoints frequently change and some public instances fail on specific routes,
  // we will show a placeholder video player and episodes list using AniList metadata for structural demonstration.
  // Ideally, you match AniList ID with Zoro/Gogoanime provider on Consumet to get the episodes.
  // Since we don't have a guaranteed working provider right now without knowing the exact slug,
  // I'll simulate the interface to ensure you have a complete Crunchyroll UI clone.

  const bannerUrl = animeInfo.bannerImage || animeInfo.coverImage.extraLarge;
  const mainTitle = animeInfo.title.english || animeInfo.title.romaji;

  return (
    <main className="min-h-screen pb-12 bg-background">
      <Header />
      
      {/* Anime Banner Banner */}
      <div className="relative w-full h-48 md:h-80 opacity-50">
        <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-24 md:-mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content (Player & Details) */}
          <div className="col-span-1 lg:col-span-3 space-y-8">
            {/* Player Area Placeholder */}
            {/* Real streamUrl is passed here */}
            <div className="bg-black aspect-video flex items-center justify-center rounded-sm overflow-hidden border-2 border-[#23252B]">
              <VideoPlayer streamUrl={streamUrl} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-black text-white">{mainTitle}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded text-sm font-semibold border border-primary/30">
                  {animeInfo.averageScore}% Rating
                </span>
                <span className="bg-[#23252B] px-3 py-1 rounded text-sm text-gray-300">
                  {animeInfo.status}
                </span>
                <span className="bg-[#23252B] px-3 py-1 rounded text-sm text-gray-300">
                  {animeInfo.episodes ? `${animeInfo.episodes} Episodes` : 'Ongoing'}
                </span>
              </div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed" 
                 dangerouslySetInnerHTML={{ __html: animeInfo.description || 'No description provided.' }} />
            </div>
          </div>

          {/* Sidebar / Episodes List */}
          <div className="col-span-1 border-l border-[#23252B] pl-0 lg:pl-6 space-y-6">
            <h3 className="text-xl font-bold border-b border-[#23252B] pb-2 text-white">Episodes</h3>
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
               {episodes.length === 0 ? (
                 <p className="text-gray-400">No episodes found.</p>
               ) : (
                 episodes.map((ep) => (
                   <Link
                    href={`/watch/${animeId}?ep=${ep.episodeId}`}
                    key={ep.episodeId} 
                    className={`flex items-center gap-4 p-3 rounded-sm transition-colors text-left ${episodeId === ep.episodeId ? 'bg-[#23252B] border-l-4 border-primary' : 'hover:bg-[#23252B]'}`}
                    prefetch={false}
                   >
                     <div className="relative w-24 aspect-video bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                        <Image src={animeInfo.coverImage.medium || ""} alt={`Episode ${ep.episodeNo}`} fill className="object-cover opacity-60" />
                     </div>
                     <div>
                       <span className="text-sm font-semibold text-gray-200 block">
                         {ep.name || `Episode ${ep.episodeNo}`}
                       </span>
                       <span className="text-xs text-gray-500">{ep.filler ? "Filler" : "Canon"}</span>
                     </div>
                   </Link>
                 ))
               )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
