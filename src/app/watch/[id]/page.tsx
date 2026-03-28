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
  
  // Standardize episodes array
  const episodes: Array<{ episodeId: string; episodeNo: number; name: string; filler: boolean }> = 
    Array.isArray(episodesData) ? episodesData : (episodesData?.episodes || []);
  
  // Default to first episode if not specified
  const currentEpisodeId = searchParams?.ep || (episodes.length > 0 ? episodes[0].episodeId : null);
  
  let streamUrl: string | null = null;
  let hasSources = false;

  if (currentEpisodeId) {
    const streamData = await getEpisodeStreamingLinks(currentEpisodeId);
    if (streamData && streamData.sources && streamData.sources.length > 0) {
      // Find the highest resolution or first valid source
      const bestSource = streamData.sources.find((s: { url: string; quality?: string }) => s.quality === "default") || streamData.sources[0];
      streamUrl = bestSource.url;
      hasSources = true;
    }
  }

  if (!animeInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Anime not found.</h2>
        <Link href="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  const bannerUrl = animeInfo.bannerImage || animeInfo.coverImage.extraLarge;
  const mainTitle = animeInfo.title.english || animeInfo.title.romaji;
  const currentEpData = episodes.find(e => e.episodeId === currentEpisodeId) || episodes[0];

  return (
    <main className="min-h-screen pb-12 bg-background">
      <Header />
      
      {/* Anime Banner */}
      <div className="relative w-full h-48 md:h-80 opacity-50">
        <Image src={bannerUrl} alt="Banner" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-24 md:-mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content (Player & Details) */}
          <div className="col-span-1 lg:col-span-3 space-y-8">
            {/* Player Area */}
            <div className="bg-black aspect-video flex items-center justify-center rounded-sm overflow-hidden border-2 border-[#23252B] shadow-2xl relative group">
              {hasSources && streamUrl ? (
                <VideoPlayer streamUrl={streamUrl} />
              ) : (
                <div className="text-center p-8 bg-[#141414] w-full h-full flex flex-col items-center justify-center">
                  <div className="mb-4 text-[#F26322] animate-pulse">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Fuentes no encontradas</h3>
                  <p className="text-gray-400 text-sm max-w-md">
                    No pudimos recuperar los enlaces de video de los servidores actuales. 
                    Esto ocurre cuando los sitios de origen actualizan sus protecciones contra scrapers.
                  </p>
                  <p className="text-xs text-gray-500 mt-4 border-t border-[#23252B] pt-4 italic">
                    Tip: Intenta recargar la página o seleccionar otro episodio.
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter">{mainTitle}</h1>
                <div className="text-right">
                   <h2 className="text-xl font-bold text-primary">
                    {currentEpData ? `Episodio ${currentEpData.episodeNo}` : ''}
                   </h2>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded text-sm font-semibold border border-primary/30">
                  {animeInfo.averageScore ? `${animeInfo.averageScore}% Rating` : 'N/A'}
                </span>
                <span className="bg-[#23252B] px-3 py-1 rounded text-sm text-gray-300">
                  {animeInfo.status}
                </span>
                <span className="bg-[#23252B] px-3 py-1 rounded text-sm text-gray-300 font-mono">
                  {episodes.length > 0 ? `${episodes.length} Episodios` : 'En emisión'}
                </span>
              </div>
              
              <div 
                className="text-gray-300 text-sm md:text-base leading-relaxed max-w-4xl font-medium" 
                dangerouslySetInnerHTML={{ __html: animeInfo.description || 'No description provided.' }} 
              />
            </div>
          </div>

          {/* Sidebar / Episodes List */}
          <div className="col-span-1 border-l border-[#23252B] pl-0 lg:pl-6 space-y-6">
            <h3 className="text-xl font-black border-b border-[#23252B] pb-2 text-white flex items-center gap-2 uppercase tracking-widest">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Episodios
            </h3>
            <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
               {episodes.length === 0 ? (
                 <p className="text-gray-400 p-4 bg-[#23252B]/30 rounded italic">No se encontraron episodios.</p>
               ) : (
                 episodes.map((ep) => (
                   <Link
                    href={`/watch/${animeId}?ep=${ep.episodeId}`}
                    key={ep.episodeId} 
                    className={`flex items-center gap-4 p-3 rounded-sm transition-all text-left group ${currentEpisodeId === ep.episodeId ? 'bg-[#23252B] border-l-4 border-primary' : 'hover:bg-[#23252B]'}`}
                    prefetch={false}
                   >
                     <div className="relative w-20 aspect-video bg-gray-800 rounded flex-shrink-0 overflow-hidden ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
                        <Image 
                          src={animeInfo.coverImage.medium || ""} 
                          alt={`Episode ${ep.episodeNo}`} 
                          fill 
                          className={`object-cover transition-opacity ${currentEpisodeId === ep.episodeId ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} 
                        />
                        {currentEpisodeId === ep.episodeId && (
                           <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                             <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                               <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                             </div>
                           </div>
                        )}
                     </div>
                     <div className="flex flex-col overflow-hidden">
                       <span className={`text-sm font-bold truncate ${currentEpisodeId === ep.episodeId ? 'text-primary' : 'text-gray-200 group-hover:text-white'}`}>
                         {ep.name || `Episodio ${ep.episodeNo}`}
                       </span>
                       <span className={`text-[10px] uppercase tracking-widest font-black ${ep.filler ? 'text-red-500' : 'text-gray-500'}`}>
                         {ep.filler ? "Relleno" : "Canon"}
                       </span>
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
