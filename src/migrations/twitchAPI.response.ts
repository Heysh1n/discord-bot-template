import axios, { AxiosInstance, AxiosError } from 'axios';
import 'dotenv/config';

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email?: string;
  created_at: string;
}

interface TwitchStream {
  id: string;
  user_id: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: 'live' | '';
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

interface TwitchUserResponse {
  data: TwitchUser[];
}

interface TwitchStreamsResponse {
  data: TwitchStream[];
}

class TwitchAPIClient {
  private clientId: string;
  private clientSecret: string;
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  private axiosInstance: AxiosInstance;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.axiosInstance = axios.create({
      baseURL: 'https://api.twitch.tv/helix',
      headers: {
        'Client-ID': this.clientId,
      },
    });

    this.axiosInstance.interceptors.request.use(async (config) => {
      if (!this.token || this.isTokenExpired()) {
        await this.refreshToken();
      }
      config.headers['Authorization'] = `Bearer ${this.token}`;
      return config;
    });
  }

  private isTokenExpired(): boolean {
    return !this.tokenExpiry || Date.now() >= this.tokenExpiry;
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await axios.post<TwitchTokenResponse>(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

    //   console.log('✅ Новый токен получен');
    } catch (error) {
      console.error('❌ Ошибка при получении токена:', error);
      throw error;
    }
  }

  // Получить информацию о пользователе по логину
  async getUserByLogin(login: string): Promise<TwitchUser | null> {
    try {
      const response = await this.axiosInstance.get<TwitchUserResponse>('/users', {
        params: { login },
      });

      if (response.data.data.length === 0) {
        console.warn(`Пользователь с логином "${login}" не найден`);
        return null;
      }

      return response.data.data[0];
    } catch (error) {
      this.handleError(error, 'getUserByLogin');
      return null;
    }
  }

  async getStreamByUserId(userId: string): Promise<TwitchStream | null> {
    try {
      const response = await this.axiosInstance.get<TwitchStreamsResponse>('/streams', {
        params: { user_id: userId },
      });

      if (response.data.data.length === 0) {
        console.log(`Стрим для user_id "${userId}" не найден (оффлайн)`);
        return null;
      }

      return response.data.data[0];
    } catch (error) {
      this.handleError(error, 'getStreamByUserId');
      return null;
    }
  }

  async getUserAndStream(login: string): Promise<{ user: TwitchUser | null; stream: TwitchStream | null }> {
    const user = await this.getUserByLogin(login);
    if (!user) {
      return { user: null, stream: null };
    }

    const stream = await this.getStreamByUserId(user.id);
    return { user, stream };
  }

  private handleError(error: unknown, methodName: string): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(`❌ Ошибка в методе ${methodName}:`, axiosError.message);
      if (axiosError.response) {
        console.error('Статус:', axiosError.response.status);
        console.error('Данные ошибки:', axiosError.response.data);
      }
    } else {
      console.error(`❌ Неизвестная ошибка в ${methodName}:`, error);
    }
  }
}

// === Пример использования ===
// Запустить и проверить через npx ts-node src/migrations/twitchAPI.response.ts
async function main() {
  const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Отсутствуют переменные окружения: TWITCH_CLIENT_ID или TWITCH_CLIENT_SECRET' + "Посмотрите файл `.env`");
    process.exit(1);
  }
  const twitchClient = new TwitchAPIClient(CLIENT_ID, CLIENT_SECRET);

  try {
    const result = await twitchClient.getUserAndStream('heysh1n');

    if (result.user) {
      console.log('👤 Пользователь:', result.user.display_name);
      console.log('🖼️  Аватар:', result.user.profile_image_url);
      console.log('👀 Всего просмотров:', result.user.view_count);
    }

    if (result.stream) {
      console.log('🎮 Играет в:', result.stream.game_name);
      console.log('📢 Название стрима:', result.stream.title);
      console.log('👁️  Зрителей:', result.stream.viewer_count);
      console.log('🕒 Начало стрима:', result.stream.started_at);
      console.log('🔴 Стрим активен!');
    } else {
      console.log('🔴 Стрим не активен или не найден');
    }
  } catch (error) {
    console.error('❌ Ошибка в main:', error);
  }
}
main();