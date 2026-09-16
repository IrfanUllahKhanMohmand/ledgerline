CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  notes TEXT,
  image_key TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'uploading', 'failed', 'complete')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS upload_jobs (
  id UUID PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES items (id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'failed', 'done')),
  last_error TEXT,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS items_user_id_idx ON items (user_id);
CREATE INDEX IF NOT EXISTS upload_jobs_item_id_idx ON upload_jobs (item_id);
CREATE INDEX IF NOT EXISTS upload_jobs_status_idx ON upload_jobs (status);
