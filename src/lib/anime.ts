// Custom backend deployed on Railway using anime-api/aniwatch routes
const API_URL = "https://anime-api-production-7aea.up.railway.app/aniwatch";

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

// 1. Fetch High-Quality Metadata from Aniwatch API (Railway)
export async function getTrendingAnime(): Promise<Anime[]> {
  try {
    const response = await fetch(`${API_URL}`, {
      next: { revalidate: 3600 },
    });
    const data = await response.json();
    
    // Merge spotlight and trending for the home page display
    const rawList = [...(data.spotLightAnimes || []), ...(data.trendingAnimes || [])];
    
    // Map properties to our standardized Anime interface
    return rawList.map((item: Record<string, unknown>) => ({
      id: String(item.id),
      title: {
        english: String(item.name),
        romaji: String(item.name),
      },
      coverImage: {
        extraLarge: String(item.poster || item.img || ""),
        medium: String(item.poster || item.img || ""),
      },
      bannerImage: item.poster || item.img ? String(item.poster || item.img) : null,
      description: item.description ? String(item.description) : "No description provided.",
      episodes: Number((item.episodes as { sub?: number })?.sub || item.episodes || 0),
      status: "Unknown",
      genres: [],
    }));
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return [];
  }
}

export async function getAnimeInfoAniList(id: string): Promise<Anime | null> {
  try {
    const response = await fetch(`${API_URL}/anime/${id}`, {
      next: { revalidate: 3600 },
    });
    const item = await response.json();
    
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
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return null;
  }
}

// 2. Fetch Episodes using the Railway Custom API
export async function getAnimeEpisodes(animeId: string) {
  try {
    const response = await fetch(`${API_URL}/episodes/${animeId}`);
    const data = await response.json();
    return data?.episodes || [];
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return [];
  }
}

// 3. Fetch .m3u8 Stream link using Railway Custom API
export async function getEpisodeStreamingLinks(episodeId: string) {
  try {
    const response = await fetch(`${API_URL}/episode/srcs?id=${episodeId}&server=vidstreaming&category=sub`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching streaming links:", error);
    return null;
  }
}
