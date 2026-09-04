export const uploadJobStatuses = [
  "queued",
  "running",
  "failed",
  "done",
] as const;

export type UploadJobStatus = (typeof uploadJobStatuses)[number];

export interface UploadJob {
  id: string;
  itemId: string;
  status: UploadJobStatus;
  lastError?: string;
  nextRetryAt?: Date;
  createdAt: Date;
}

export function enqueueUpload(input: { itemId: string; id?: string }): UploadJob {
  if (!input.itemId.trim()) {
    throw new Error("itemId is required");
  }

  return {
    id: input.id ?? crypto.randomUUID(),
    itemId: input.itemId,
    status: "queued",
    createdAt: new Date(),
  };
}
