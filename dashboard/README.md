# SNAPBOX Web Dashboard

Dashboard responsif untuk akses dari laptop, tablet, dan ponsel. Folder ini dipublikasikan sebagai website statis; kontrol kamera/printer tetap dijalankan oleh komputer kiosk.

## Konfigurasi Supabase Auth

1. Salin `config.example.js` menjadi `config.js`.
2. Isi `supabaseUrl` dengan Project URL dan `supabaseAnonKey` dengan anon/publishable key dari Supabase.
3. Jangan pernah memasukkan `service_role` key ke file browser.
4. Buat akun pengguna melalui Supabase Auth. Saat ini halaman login memvalidasi akun Supabase; pembatasan role admin/operator dan kebijakan RLS untuk data dashboard belum dibuat.
5. Jangan aktifkan akses data produksi sebelum tabel, role, dan RLS selesai diuji.

`config.js` yang dikomit sekarang masih kosong agar tidak mengarang kredensial project. Karena itu login akan menampilkan pesan konfigurasi sampai URL dan anon key yang benar dimasukkan.

## Publikasi GitHub Pages

Workflow `.github/workflows/publish-dashboard.yml` akan membangun publikasi statis dari folder ini setelah perubahan masuk ke branch `main`.

1. Merge Pull Request fondasi ke `main` setelah CI lulus.
2. Buka **Settings → Pages** di repository.
3. Pada **Build and deployment**, pilih **Source: GitHub Actions**.
4. Pastikan workflow **Publish SNAPBOX dashboard** selesai dengan status sukses.
5. URL akan muncul di **Settings → Pages** dan pada ringkasan deployment workflow.

Dashboard ini saat ini adalah fondasi autentikasi dan tampilan monitoring. Status kiosk, kamera, printer, sesi, preset, dan Google Drive belum membaca data backend sampai Kiosk Agent, skema database, role, dan RLS diimplementasikan.
