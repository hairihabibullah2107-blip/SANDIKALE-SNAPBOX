# SANDIKALE PHOTOBOOTH (Nikon COOLPIX P1000)

## Menjalankan (Windows, Node 20)
```
npm install
copy .env.example .env     # isi nilainya
npm run dev
npm run build
```
## Supabase
1. Buat project di supabase.com, jalankan `supabase/migrations/0001_init.sql`.
2. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_KEY` di `.env`.

## GitHub
```
git init
git add .
git commit -m "Fase 1: foundation"
git branch -M main
git remote add origin https://github.com/USERNAME/photobooth-kiosk.git
git push -u origin main
```
## Fase
1 Foundation (ini) -> 2 Database -> 3 Frame -> 4 Diagnostic Nikon -> ... -> 19 Installer.
