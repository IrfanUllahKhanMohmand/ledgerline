import { hashPassword, verifyPassword } from "../auth/password.js";
import { createItem, type Item } from "../models/item.js";
import { enqueueUpload, type UploadJob } from "../models/upload-job.js";
import { createUser, type User } from "../models/user.js";

export class LedgerStore {
  private readonly users = new Map<string, User>();
  private readonly byEmail = new Map<string, string>();
  private readonly items = new Map<string, Item[]>();
  private readonly itemsById = new Map<string, Item>();
  private readonly uploadJobs = new Map<string, UploadJob>();

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
    this.itemsById.set(item.id, item);
    return item;
  }

  listItems(userId: string): Item[] {
    return [...(this.items.get(userId) ?? [])];
  }

  getItem(userId: string, itemId: string): Item | undefined {
    const item = this.itemsById.get(itemId);
    return item?.userId === userId ? item : undefined;
  }

  startUpload(userId: string, itemId: string, imageKey: string): UploadJob {
    const item = this.getItem(userId, itemId);
    if (!item) {
      throw new Error("item not found");
    }
    const key = imageKey.trim();
    if (!key) {
      throw new Error("imageKey is required");
    }

    item.imageKey = key;
    item.status = "uploading";
    const job = enqueueUpload({ itemId: item.id });
    this.uploadJobs.set(job.id, job);
    return this.runUpload(job.id);
  }

  retryUpload(userId: string, jobId: string): UploadJob {
    const job = this.uploadJobs.get(jobId);
    if (!job) {
      throw new Error("job not found");
    }
    const item = this.getItem(userId, job.itemId);
    if (!item) {
      throw new Error("job not found");
    }
    if (job.status !== "failed") {
      throw new Error("only failed jobs can be retried");
    }

    job.status = "queued";
    job.lastError = undefined;
    job.nextRetryAt = undefined;
    item.status = "uploading";
    return this.runUpload(job.id);
  }

  listUploadJobs(userId: string): UploadJob[] {
    const itemIds = new Set(this.listItems(userId).map((item) => item.id));
    return [...this.uploadJobs.values()].filter((job) =>
      itemIds.has(job.itemId),
    );
  }

  private runUpload(jobId: string): UploadJob {
    const job = this.uploadJobs.get(jobId);
    if (!job) {
      throw new Error("job not found");
    }

    const item = this.itemsById.get(job.itemId);
    if (!item?.imageKey) {
      throw new Error("item not found");
    }

    job.status = "running";
    item.attemptCount += 1;

    const shouldFail =
      item.imageKey.startsWith("fail-once:") && item.attemptCount === 1;

    if (shouldFail) {
      job.status = "failed";
      job.lastError = "upload interrupted";
      job.nextRetryAt = new Date(Date.now() + 60_000);
      item.status = "failed";
      return job;
    }

    job.status = "done";
    item.status = "complete";
    return job;
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

export function serializeUploadJob(job: UploadJob) {
  return {
    id: job.id,
    itemId: job.itemId,
    status: job.status,
    lastError: job.lastError,
    nextRetryAt: job.nextRetryAt?.toISOString(),
    createdAt: job.createdAt.toISOString(),
  };
}
