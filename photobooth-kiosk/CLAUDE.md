# RULES FILE: SANDIKALE PHOTOBOOTH
Baca file ini sebelum mengubah kode.
- Stack: Electron + React + TS + Vite + Tailwind. Database: Supabase (Postgres). Repo: GitHub.
- Renderer tidak boleh akses Node/secret. Semua hardware, DB, dan secret hanya di `electron/` (main).
- IPC: lewat `electron/ipc/index.ts`, wajib validasi zod + cek sender.
- SUPABASE_SERVICE_KEY hanya di `.env` PC kiosk. Jangan commit, jangan kirim ke renderer.
- Jangan buat fitur/hardware palsu. Jangan klaim selesai sebelum diuji.
- Satu sesi = satu cetak (unique session_id di DB). Status UNKNOWN tidak dikirim ulang otomatis.
- Filter hanya pada foto, bukan frame.
- Jangan ubah file tak terkait; jangan hapus fitur yang sudah jalan.
- Urutan fase: lihat README. Fase berikutnya hanya setelah fase sebelumnya lulus uji.
