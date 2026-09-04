export const itemStatuses = [
  "pending",
  "uploading",
  "failed",
  "complete",
] as const;

export type ItemStatus = (typeof itemStatuses)[number];

export interface Item {
  id: string;
  userId: string;
  title: string;
  notes?: string;
  imageKey?: string;
  status: ItemStatus;
  attemptCount: number;
  createdAt: Date;
}

export function createItem(input: {
  userId: string;
  title: string;
  notes?: string;
  id?: string;
}): Item {
  const title = input.title.trim();
  if (!input.userId.trim()) {
    throw new Error("userId is required");
  }
  if (!title) {
    throw new Error("title is required");
  }

  return {
    id: input.id ?? crypto.randomUUID(),
    userId: input.userId,
    title,
    notes: input.notes?.trim() || undefined,
    status: "pending",
    attemptCount: 0,
    createdAt: new Date(),
  };
}
