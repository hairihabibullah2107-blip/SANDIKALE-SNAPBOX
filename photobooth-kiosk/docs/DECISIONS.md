# Keputusan Teknis
1. Database: Supabase (permintaan user). Risiko: butuh internet. Mitigasi (Fase 2): antrean lokal agar kamera, cetak, dan komposisi tetap jalan offline; kunci cetak lokal sebelum sinkron.
2. Service key hanya di main process; RLS aktif tanpa policy publik.
3. Renderer sandbox + contextIsolation, CSP ketat.
4. Preload tanpa dependency selain electron.
