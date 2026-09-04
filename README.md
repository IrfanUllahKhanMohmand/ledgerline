# Ledgerline

Field-item capture: submit a photo plus metadata, retry failed uploads, optional test-mode payment later. This is a reliability sample, not a cheque product and not a family check-in app.

## Status

Scaffold (4 Sep 2026): repo layout, core models, Docker Compose stub (Postgres + MinIO). Auth, retry worker, and the Flutter capture flow come on later weekdays.

## Layout

```
apps/api      TypeScript + Express (Postgres + S3 later)
apps/mobile   Flutter (iOS, Android, web)
```

## Run locally

**API** (no Postgres required for this scaffold):

```bash
cd apps/api
cp .env.example .env
npm install
npm run dev
```

**Compose** (Postgres + MinIO + API image):

```bash
docker compose up --build
```

**Mobile:**

```bash
cd apps/mobile
flutter pub get
flutter run
```

## Models

- `User` — account that owns items
- `Item` — one capture (title, optional notes, image key, status, attempt count)
- `UploadJob` — queued retry for a failed item

## v1 target

Auth, create item + image, retry failed uploads, OpenAPI, one Flutter flow, Stripe test or mock.
