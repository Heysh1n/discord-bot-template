import 'dotenv/config';
import axios, { AxiosInstance } from 'axios';


export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
  };
  viewCount: string;
  subscriberCount: string;
  videoCount: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    high?: { url: string };
    standard?: {url: string};
    maxres?: { url: string};
  };
  channelTitle: string;
}

export class YouTubeAPIClient {
  private apiKey: string;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('❌ YOUTUBE_API_KEY не задан в .env');
    }

    this.axiosInstance = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      params: {
        key: this.apiKey,
      },
    });
  }

  async getChannelByHandle(handle: string): Promise<YouTubeChannel | null> {
    if (!handle) {
      console.warn('⚠️ YouTube: не указан handle канала');
      return null;
    }

    try {
      const response = await this.axiosInstance.get('/channels', {
        params: {
          forHandle: handle,
          part: 'snippet,statistics',
        },
      });

      if (!response.data?.items?.length) {
        console.warn(`🔴 YouTube: канал с handle "${handle}" не найден`);
        return null;
      }

      const item = response.data.items[0];
      const channel: YouTubeChannel = {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        customUrl: item.snippet.customUrl,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        viewCount: item.statistics.viewCount,
        subscriberCount: item.statistics.subscriberCount,
        videoCount: item.statistics.videoCount,
      };

      console.log(`✅ YouTube: канал "${channel.title}" успешно получен`);
      return channel;
    } catch (error: any) {
      console.error(`❌ Ошибка YouTube API при получении канала "${handle}":`, error.message);
      if (error.response) {
        console.error('Статус:', error.response.status);
        console.error('Тело ошибки:', error.response.data);
      }
      return null;
    }
  }

  async getLatestVideos(channelId: string, maxResults = 5): Promise<YouTubeVideo[]> {
    if (!channelId) {
      console.warn('⚠️ YouTube: не указан ID канала для получения видео');
      return [];
    }

    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          channelId,
          part: 'snippet',
          order: 'date',
          type: 'video',
          maxResults,
        },
      });

      if (!response.data?.items?.length) {
        console.log(`🟡 YouTube: у канала ${channelId} нет последних видео`);
        return [];
      }

      const videos = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        channelTitle: item.snippet.channelTitle
      }));

      console.log(`✅ YouTube: получено ${videos.length} последних видео`);
      return videos;
    } catch (error: any) {
      console.error(`❌ Ошибка YouTube API при получении видео для канала ${channelId}:`, error.message);
      if (error.response) {
        console.error('Статус:', error.response.status);
        console.error('Тело ошибки:', error.response.data);
      }
      return [];
    }
  }
}


// === Пример использования ===
// Запустить и проверить через npx ts-node src/migrations/youtubeAPI.response.ts
async function main() {
  const youtube = new YouTubeAPIClient();
  const channel = await youtube.getChannelByHandle('@heysh1n');
  if (channel) {
    const videos = await youtube.getLatestVideos(channel.id, 3);
    videos.forEach((video, i) => {
      console.log(`\n🎥 Видео ${i + 1}: ${video.title}`);
      console.log(`👥 Пописчики: ${channel.subscriberCount}`);
      console.log(`📅 Опубликовано: ${video.publishedAt}`);
    });
  }
}

// Запускаем main(), только если файл запущен напрямую
if (require.main === module) {
  main().catch(console.error);
}

export default YouTubeAPIClient;