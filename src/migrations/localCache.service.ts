import fs from "fs";
import path from "path";
// Используеться для кеширование данных пользователя для работы с ними в других программах
// Неиспользуемые кеш-данные очищяет после перезапуска
const dirPath = path.join(__dirname, "../config/db");
const filePath = path.join(dirPath, "actionCache.json");

/**
 * LocalCache хранит связь messageId → userId
 */
class LocalCache {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
    this.ensureFile();
    this.load();
  }

  /**
   * Сохранить userId по messageId
   */
  set(messageId: string, userId: string): void {
    this.cache.set(messageId, userId);
    this.save();
  }

  /**
   * Получить userId по messageId
   */
  get(messageId: string): string | undefined {
    return this.cache.get(messageId);
  }

  /**
   * Удалить запись по messageId
   */
  delete(messageId: string): void {
    this.cache.delete(messageId);
    this.save();
  }

  /**
   * Очистить весь кеш
   */
  clear(): void {
    this.cache.clear();
    this.save();
  }

  /**
   * Сохранение кеша в JSON
   */
  private save(): void {
    try {
      const data = JSON.stringify([...this.cache.entries()], null, 2);
      fs.writeFileSync(filePath, data, "utf-8");
    } catch (err) {
      console.error("[CACHE] Ошибка при сохранении:", err);
    }
  }

  /**
   * Загрузка кеша из JSON
   */
  private load(): void {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const data: [string, string][] = JSON.parse(raw);
        this.cache = new Map(data);
      }
    } catch (err) {
      console.error("[CACHE] Ошибка при загрузке:", err);
      this.cache = new Map();
    }
  }

  /**
   * Проверка и создание папок/файлов
   */
  private ensureFile(): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf-8");
    }
  }
}

export const ActionCache = new LocalCache();
