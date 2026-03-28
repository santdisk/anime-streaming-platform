// API Configuration with Fallbacks
const PRIMARY_API = "https://anime-api-production-7aea.up.railway.app/aniwatch";
const FALLBACK_APIS = [
  "https://api-anime-rouge.vercel.app/aniwatch",
  "https://api.consumet.org/anime/gogoanime",
];

export interface Anime {
  id: string;
  title: {
    english: string;
    romaji: string;
  };
  coverImage: {
    extraLarge: string;
    medium: string;
  };
  bannerImage: string | null;
  description: string;
  episodes: number;
  status: string;
  averageScore?: number;
  genres: string[];
}

interface RawAnimeItem {
  id: string | number;
  name?: string;
  title?: string;
  poster?: string;
  img?: string;
  description?: string;
  episodes?: number | { sub?: number };
}

// Helper to fetch from multiple instances if one fails or returns empty data
async function fetchFromAPI(path: string, isSource: boolean = false) {
  // Try primary Railway API first
  try {
    const url = `${PRIMARY_API}${path}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (isSource && (!data.sources || data.sources.length === 0)) {
        console.warn(`Primary API returned empty sources for ${path}. Trying fallbacks...`);
      } else {
        return data;
      }
    }
  } catch (error) {
    console.error(`Primary API failed:`, error);
  }

  // Try fallbacks
  for (const fallback of FALLBACK_APIS) {
    try {
      // Consumet Gogo uses /watch instead of /episode/srcs
      let finalPath = path;
      if (fallback.includes("gogoanime") && path.includes("/episode/srcs")) {
        const episodeId = new URLSearchParams(path.split("?")[1]).get("id");
        finalPath = `/watch/${episodeId}`;
      }

      const url = `${fallback}${finalPath}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (isSource && (!data.sources || data.sources.length === 0)) continue;
        return data;
      }
    } catch {
      continue;
    }
  }
  return null;
}

// 1. Fetch High-Quality Metadata
export async function getTrendingAnime(): Promise<Anime[]> {
  const data = await fetchFromAPI("");
  if (!data) return [];
  
  const rawList = [...(data.spotLightAnimes || []), ...(data.trendingAnimes || [])];
  
  return rawList.map((item: RawAnimeItem) => ({
    id: String(item.id),
    title: {
      english: String(item.name || item.title || "Unknown"),
      romaji: String(item.name || item.title || "Unknown"),
    },
    coverImage: {
      extraLarge: String(item.poster || item.img || ""),
      medium: String(item.poster || item.img || ""),
    },
    bannerImage: item.poster || item.img ? String(item.poster || item.img) : null,
    description: item.description ? String(item.description) : "No description provided.",
    episodes: Number(typeof item.episodes === "object" ? item.episodes?.sub : item.episodes || 0),
    status: "Unknown",
    genres: [],
  }));
}

export async function getAnimeInfoAniList(id: string): Promise<Anime | null> {
  const item = await fetchFromAPI(`/anime/${id}`);
  if (!item?.info) return null;

  const info = item.info;
  return {
    id: info.id || id,
    title: {
      english: info.name,
      romaji: info.name,
    },
    coverImage: {
      extraLarge: info.img || info.poster || "",
      medium: info.img || info.poster || "",
    },
    bannerImage: info.img || info.poster || null,
    description: info.description || "No description provided.",
    episodes: item.episodes?.length || 0,
    status: info.stats?.status || "Unknown",
    genres: [],
  };
}

// 2. Fetch Episodes
export async function getAnimeEpisodes(animeId: string) {
  const data = await fetchFromAPI(`/episodes/${animeId}`);
  return data?.episodes || [];
}

// 3. Fetch .m3u8 Stream link
export async function getEpisodeStreamingLinks(episodeId: string) {
  const data = await fetchFromAPI(`/episode/srcs?id=${episodeId}&server=vidstreaming&category=sub`, true);
  return data;
}
