import axios, { AxiosInstance } from 'axios';
import 'dotenv/config';

export interface TelegramMessage {
  message_id: number;
  text?: string;
  date: number;
  chat: {
    id: number;
    type: string;
    title?: string;
    username?: string;
  };
}

export class TelegramAPIClient {
  private axiosInstance: AxiosInstance;

  constructor(private botToken: string) {
    if (!botToken) {
      console.error("❌ TELEGRAM_BOT_TOKEN не указан");
      throw new Error('❌ TELEGRAM_BOT_TOKEN не указан');
    }

    this.axiosInstance = axios.create({
      baseURL: `https://api.telegram.org/bot${this.botToken}`,
    });
  }

  /** Отправить сообщение */
  async sendMessage(chatId: string | number, text: string): Promise<TelegramMessage | null> {
    try {
      const response = await this.axiosInstance.post('/sendMessage', {
        chat_id: chatId,
        text,
      });
      return response.data.result;
    } catch (error) {
      console.error('❌ Ошибка Telegram sendMessage:', error);
      return null;
    }
  }

  /** Получить новые апдейты (polling) */
  async getUpdates(offset?: number): Promise<TelegramMessage[]> {
    try {
      const response = await this.axiosInstance.get('/getUpdates', {
        params: { offset },
      });
      return response.data.result.map((u: any) => u.message).filter(Boolean);
    } catch (error) {
      console.error('❌ Ошибка Telegram getUpdates:', error);
      return [];
    }
  }

  /** Установить Webhook */
  async setWebhook(url: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post('/setWebhook', { url });
      console.log(`✅ Webhook установлен: ${url}`);
      return response.data.ok;
    } catch (error) {
      console.error('❌ Ошибка при установке Webhook:', error);
      return false;
    }
  }

  /** Удалить Webhook */
  async deleteWebhook(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post('/deleteWebhook');
      console.log('✅ Webhook удалён');
      return response.data.ok;
    } catch (error) {
      console.error('❌ Ошибка при удалении Webhook:', error);
      return false;
    }
  }

  /** Информация о Webhook */
  async getWebhookInfo(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/getWebhookInfo');
      return response.data.result;
    } catch (error) {
      console.error('❌ Ошибка getWebhookInfo:', error);
      return null;
    }
  }
}

// === Тестовое использование ===
async function main() {
  console.log("🚀 Запуск Telegram API клиента...\n");

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "your-token-bot";
  const CHAT_ID = process.env.GROUP_CHAT_ID || "your-token-bot";
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("❌ Укажи TELEGRAM_BOT_TOKEN и TEST_CHAT_ID в .env");
    process.exit(1);
  }

  const telegram = new TelegramAPIClient(BOT_TOKEN);

  // Отправим тестовое сообщение
  const msg = await telegram.sendMessage(CHAT_ID, "Привет 👋 Тестовое сообщение через API");
  if (msg) {
    console.log("✅ Сообщение отправлено:", msg.text);
  }

  // Получим апдейты (если webhook не стоит)
  const updates = await telegram.getUpdates();
  if (updates.length > 0) {
    console.log(`📩 Получено ${updates.length} сообщений`);
    updates.forEach((u) =>
      console.log(`Сообщение от ${u.chat.username || u.chat.id}: ${u.text}`)
    );
  } else {
    console.log("⚠️ Новых апдейтов нет (либо стоит webhook).");
  }

  console.log("\n✅ Работа Telegram API завершена.");
}

if (require.main === module) {
  main().catch(console.error);
}

export default TelegramAPIClient;
