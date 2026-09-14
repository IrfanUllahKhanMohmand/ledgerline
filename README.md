# Ledgerline

Capture an item with a photo and notes. Failed uploads retry automatically. Optional test-mode payments can sit on top of the same flow.

Flutter client with a Node.js API. Postgres for data, MinIO for object storage. Docker Compose for local services.

## Run

API:

```bash
cd apps/api
cp .env.example .env
npm install
npm run dev
```

API + Postgres + MinIO:

```bash
docker compose up --build
```

## API

```
GET /health
```

Mobile (iOS, Android, or web):

```bash
cd apps/mobile
flutter pub get
flutter run
```

## Repo

```
apps/api      Express, TypeScript
apps/mobile   Flutter
```
