# SANDIKALE SNAPBOX

Aplikasi photobooth berbasis Electron + React + TypeScript. Komputer kiosk menjadi pengendali perangkat keras; dashboard laptop/tablet/HP akan memakai antarmuka web responsif dan layanan sinkronisasi terautentikasi.

## Status saat ini

Fondasi yang tersedia:
- Electron dengan context isolation, sandbox, dan renderer tanpa Node.js.
- Pemeriksaan konfigurasi dan health check Supabase dasar.
- IPC tervalidasi menggunakan Zod.
- Deteksi daftar printer yang terpasang pada komputer kiosk melalui driver sistem operasi (setelah implementasi tahap ini diuji).

Fitur yang BELUM tersedia dan tidak boleh dianggap selesai:
- Live capture Nikon COOLPIX P1000.
- Pemilihan preset frame dan komposisi foto.
- Print worker dan antrean cetak idempoten.
- Dashboard web multi-device dengan autentikasi dan role.
- Sinkronisasi offline/online lengkap.
- Upload Google Drive dan penghapusan otomatis setelah 24 jam.

## Menjalankan aplikasi (Windows, Node.js 20)

```powershell
npm install
Copy-Item .env.example .env
# Edit .env dan isi konfigurasi yang diperlukan
npm run dev
```

Pemeriksaan sebelum build:

```powershell
npm run typecheck
npm test
npm run build
```

## Konfigurasi Supabase

1. Buat project Supabase.
2. Jalankan migration di `supabase/migrations/`.
3. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_KEY` pada file `.env` komputer kiosk.
4. Service key hanya boleh berada di proses utama Electron, tidak boleh masuk ke renderer atau repository.

## Arsitektur perangkat

- **Kiosk PC:** terhubung langsung ke Nikon dan printer; menjalankan capture, pemrosesan foto, dan print worker.
- **Laptop/tablet/HP:** mengakses dashboard web responsif untuk administrasi dan monitoring.
- **Supabase:** menyimpan data transaksi, status perangkat, dan sinkronisasi yang diizinkan.
- **Printer:** daftar printer dibaca dari driver sistem operasi pada kiosk PC. Printer harus terpasang dan dikenali OS.

Tablet/HP tidak dapat langsung mengendalikan kamera atau printer yang terhubung secara fisik ke PC kiosk. Perintah perangkat keras harus divalidasi dan dieksekusi oleh worker pada PC kiosk.

## Aturan keselamatan cetak

- Satu sesi hanya boleh memiliki satu pekerjaan cetak.
- Gunakan idempotency key unik dan constraint database untuk mencegah duplikasi.
- Status hasil cetak yang tidak pasti harus menjadi `PRINT_STATUS_UNKNOWN` dan tidak boleh dikirim ulang otomatis.
- Deteksi printer bukan bukti bahwa printer siap mencetak; kesiapan dan hasil cetak harus diverifikasi oleh print worker.

## Urutan implementasi

1. Fondasi aplikasi, konfigurasi, IPC, dan deteksi printer.
2. Skema database, autentikasi admin, role, dan status perangkat.
3. Dashboard multi-device responsif dan sinkronisasi.
4. Manajemen preset frame dan template foto.
5. Diagnostik serta integrasi Nikon COOLPIX P1000.
6. Capture, preview, dan komposisi hasil foto.
7. Print worker, pemilihan printer, idempotensi, dan pemulihan kegagalan.
8. Penyimpanan lokal, upload Google Drive, serta retensi 24 jam.
9. Pengujian perangkat nyata, monitoring, dan installer.

Setiap tahap harus lulus typecheck, test, build, dan uji perangkat yang relevan sebelum dinyatakan selesai.
