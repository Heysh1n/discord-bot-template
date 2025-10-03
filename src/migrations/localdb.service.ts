import fs from "fs";
import path from "path";

export interface WarnEntry {
  type: "warn";
  reason: string;
  moderator: string;
  date: string;
}

export interface StaffWarnEntry {
  type: "staff_warn";
  reason: string;
  moderator: string;
  date: string;
}

export interface RemarkEntry {
  type: "remark";
  reason: string;
  moderator: string;
  date: string;
}

export interface StaffLockEntry {
  action: "add_lock" | "remove_lock";
  reason?: string;
  moderator: string;
  dateStart: string;
  dateEnd: string;
}

export interface MuteEntry {
    action: string;
    reason: string;
    moderator: string;
    dateStart: string;
    dateEnd: string;
}

export interface BanEntry {
    action: string;
    reason: string;
    moderator: string;
    dateStart: string;
    dateEnd: string;
}

export interface TimeoutEntry {
    action: string;
    reason: string;
    moderator: string;
    dateStart: string;
    dateEnd: string;
}

export interface UserData {
  username: string;
  muted: boolean;
  banned: boolean;
  timeoutEndDate?: string;
  staffLocked: boolean;
  warns: WarnEntry[];
  staffWarns: StaffWarnEntry[];
  remarks: RemarkEntry[];
  staffLockHistory: StaffLockEntry[];
  banHistory: BanEntry[];
  muteHistory: MuteEntry[];
  timeoutHistory: TimeoutEntry[];
}

export class LocalDB {
  private static filePath = path.resolve(__dirname, "../config/db/users.json");

  private static load(): Record<string, UserData> {
    if (!fs.existsSync(this.filePath)) {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify({}, null, 2), "utf-8");
    }
    return JSON.parse(fs.readFileSync(this.filePath, "utf-8") || "{}");
  }

  private static save(data: Record<string, UserData>) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  static getUser(userId: string): UserData | null {
    const data = this.load();
    return data[userId] || null;
  }

  static saveUser(userId: string, userData: UserData) {
    const data = this.load();
    data[userId] = userData;
    this.save(data);
  }

  static updateUser(userId: string, partial: Partial<UserData>) {
    const data = this.load();
    if (!data[userId]) {
      data[userId] = this.createUser(userId, partial.username || "unknown");
    }
    data[userId] = { ...data[userId], ...partial };
    this.save(data);
  }

  static createUser(userId: string, username: string): UserData {
    const data = this.load();
    if (!data[userId]) {
      data[userId] = {
        username,
        muted: false,
        timeoutEndDate: undefined,
        banned: false,
        staffLocked: false,
        warns: [],
        staffWarns: [],
        remarks: [],
        staffLockHistory: [],
        banHistory: [],
        muteHistory: [],
        timeoutHistory: [],
      };
      this.save(data);
    }
    return data[userId];
  }

  static getAllUsers(): UserData[] {
    const data = this.load();
    return Object.values(data);
  }

  static getAllUsersMap(): Record<string, UserData> {
    return this.load();
  }

  static addWarn(userId: string, warn: WarnEntry, username: string) {
    const user = this.getUser(userId) ?? this.createUser(userId, username);
    user.warns.push(warn);
    this.saveUser(userId, user);
  }

  static removeLastWarn(userId: string) {
    const user = this.getUser(userId);
    if (!user || !user.warns.length) return;
    user.warns.pop();
    this.saveUser(userId, user);
  }

  static addStaffWarn(userId: string, warn: StaffWarnEntry, username: string) {
    const user = this.getUser(userId) ?? this.createUser(userId, username);
    user.staffWarns.push(warn);
    this.saveUser(userId, user);
  }

  static removeLastStaffWarn(userId: string) {
    const user = this.getUser(userId);
    if (!user || !user.staffWarns.length) return;
    user.staffWarns.pop();
    this.saveUser(userId, user);
  }

  static addRemark(userId: string, remark: RemarkEntry, username: string) {
    const user = this.getUser(userId) ?? this.createUser(userId, username);
    user.remarks.push(remark);
    this.saveUser(userId, user);
  }

  static removeLastRemark(userId: string) {
    const user = this.getUser(userId);
    if (!user || !user.remarks.length) return;
    user.remarks.pop();
    this.saveUser(userId, user);
  }

  static addBanHistory(userId: string, ban: BanEntry, username: string) {
    const user = this.getUser(userId) ?? this.createUser(userId, username);
    user.banHistory.push(ban);
    user.banned = ban.action === "ban";
    this.saveUser(userId, user);
  }

  static removeBan(userId: string) {
    const user = this.getUser(userId);
    if (!user || !user.banHistory.length) return;
    user.banHistory.pop();
    user.banned = false;
    this.saveUser(userId, user);
  }

  static addStaffLockHistory(userId: string, lock: StaffLockEntry, username: string) {
    const user = this.getUser(userId) ?? this.createUser(userId, username);
    user.staffLockHistory.push(lock);
    user.staffLocked = lock.action === "add_lock";
    this.saveUser(userId, user);
  }

  static addMuteHistory(userId: string, mute: MuteEntry, username: string) {
    const user = this.getUser(userId) ?? this.createUser(userId, username);
    user.muteHistory.push(mute);
    user.muted = true;
    this.saveUser(userId, user);
  }

  static removeMute(userId: string) {
    const user = this.getUser(userId);
    if (!user || !user.muteHistory.length) return;
    user.muteHistory.pop();
    user.muted = false;
    this.saveUser(userId, user);
  }

  static addTimeoutHistory(userId: string, timeout: TimeoutEntry, username: string) {
    const user = this.getUser(userId) ?? this.createUser(userId, username);
    user.timeoutHistory.push(timeout);
    this.saveUser(userId, user);
  }

  static removeTimeout(userId: string) {
    const user = this.getUser(userId);
    if (!user || !user.timeoutHistory.length) return;
    user.timeoutHistory.pop();
    this.saveUser(userId, user);
  }

  static isUserTimeouted(userId: string): boolean {
    const user = this.getUser(userId);
    if (!user || !user.timeoutEndDate) return false;
    return new Date(user.timeoutEndDate).getTime() > Date.now();
  }

  static setTimeoutEndDate(userId: string, dateEnd: string, username: string) {
    const user = this.getUser(userId) ?? this.createUser(userId, username);
    if (user.timeoutHistory.length > 0) {
      user.timeoutHistory[user.timeoutHistory.length - 1].dateEnd = dateEnd;
    } else {
      user.timeoutHistory.push({
        action: "timeout",
        reason: "Не указана причина",
        moderator: "system",
        dateStart: new Date().toISOString(),
        dateEnd,
      });
    }
    this.saveUser(userId, user);
  }

  static cleanup() {
    const data = this.load();
    let cleaned = 0;

    for (const [userId, user] of Object.entries(data)) {
      const hasHistory = [
        user.warns,
        user.staffWarns,
        user.remarks,
        user.staffLockHistory,
        user.banHistory,
        user.muteHistory,
        user.timeoutHistory,
      ].some(arr => (arr?.length ?? 0) > 0);

      if (!hasHistory) {
        delete data[userId];
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.save(data);
      console.log(`[LocalDB] Очищено пользователей без истории: ${cleaned}`);
    }
  }
}