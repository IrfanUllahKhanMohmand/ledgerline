import { hashPassword, verifyPassword } from "../auth/password.js";
import { createItem, type Item } from "../models/item.js";
import { createUser, type User } from "../models/user.js";

export class LedgerStore {
  private readonly users = new Map<string, User>();
  private readonly byEmail = new Map<string, string>();
  private readonly items = new Map<string, Item[]>();

  async register(email: string, password: string): Promise<User> {
    const key = email.trim().toLowerCase();
    if (this.byEmail.has(key)) {
      throw new Error("email is taken");
    }
    const user = createUser({
      email,
      passwordHash: await hashPassword(password),
    });
    this.users.set(user.id, user);
    this.byEmail.set(user.email, user.id);
    this.items.set(user.id, []);
    return user;
  }

  async authenticate(email: string, password: string): Promise<User | undefined> {
    const id = this.byEmail.get(email.trim().toLowerCase());
    if (!id) {
      return undefined;
    }
    const user = this.users.get(id);
    if (!user?.passwordHash) {
      return undefined;
    }
    const ok = await verifyPassword(password, user.passwordHash);
    return ok ? user : undefined;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  addItem(userId: string, title: string, notes?: string): Item {
    if (!this.users.has(userId)) {
      throw new Error("user not found");
    }
    const item = createItem({ userId, title, notes });
    this.items.get(userId)!.push(item);
    return item;
  }

  listItems(userId: string): Item[] {
    return [...(this.items.get(userId) ?? [])];
  }
}

export function serializeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}

export function serializeItem(item: Item) {
  return {
    id: item.id,
    userId: item.userId,
    title: item.title,
    notes: item.notes,
    imageKey: item.imageKey,
    status: item.status,
    attemptCount: item.attemptCount,
    createdAt: item.createdAt.toISOString(),
  };
}
