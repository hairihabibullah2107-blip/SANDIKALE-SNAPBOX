import { useCallback, useEffect, useState } from 'react';

type DbState = { ok: boolean; detail: string } | null;
type Printer = {
  name: string;
  displayName: string;
  description: string;
  isDefault: boolean;
  status: number;
};

export default function App() {
  const [info, setInfo] = useState('Menghubungkan perangkat...');
  const [db, setDb] = useState<DbState>(null);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [printerState, setPrinterState] = useState<'checking' | 'ready' | 'empty' | 'error'>('checking');

  const refreshPrinters = useCallback(async () => {
    if (!window.kiosk?.listPrinters) {
      setPrinterState('error');
      return;
    }
    setPrinterState('checking');
    try {
      const found = await window.kiosk.listPrinters();
      setPrinters(found);
      setPrinterState(found.length ? 'ready' : 'empty');
    } catch {
      setPrinters([]);
      setPrinterState('error');
    }
  }, []);

  useEffect(() => {
    if (!window.kiosk) {
      setInfo('Jalankan melalui aplikasi desktop untuk mengakses perangkat');
      setDb({ ok: false, detail: 'IPC desktop tidak tersedia' });
      setPrinterState('error');
      return;
    }

    window.kiosk.ping('sindikale-snapbox')
      .then((r) => window.kiosk.info().then((i) => setInfo(`${r.pong} · ${i.env} v${i.version}`)))
      .catch(() => setInfo('Perangkat belum terhubung'));

    window.kiosk.dbHealth()
      .then(setDb)
      .catch(() => setDb({ ok: false, detail: 'Koneksi belum tersedia' }));

    void refreshPrinters();
  }, [refreshPrinters]);

  return (
    <main className="kiosk-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#" aria-label="Sandikale Photobooth">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">SANDIKALE <b>PHOTOBOOTH</b></span>
        </a>
        <div className="top-meta">
          <span className="live-dot" />
          <span>SELF PHOTO STUDIO</span>
          <span className="meta-divider" />
          <span>CAPTURE YOUR MOMENT</span>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> YOUR MOMENT, YOUR STORY</div>
          <h1>MAKE IT<br /><em>MEMORABLE.</em></h1>
          <p className="intro">Satu momen, banyak cerita. Abadikan keseruanmu bersama SANDIKALE PHOTOBOOTH.</p>
          <div className="cta-wrap">
            <button className="start-button" disabled aria-label="Mulai photobooth, fitur akan tersedia pada fase berikutnya">
              <span className="button-icon">↗</span>
              <span><strong>START PHOTOBOOTH</strong><small>FITUR SEGERA HADIR</small></span>
            </button>
            <p className="tap-note">SENTUH UNTUK MEMULAI SESI FOTO</p>
          </div>
          <div className="feature-row">
            <div><span className="feature-number">01</span><span>POSE YOUR WAY</span></div>
            <div><span className="feature-number">02</span><span>CAPTURE THE MOMENT</span></div>
            <div><span className="feature-number">03</span><span>KEEP THE MEMORY</span></div>
          </div>
        </div>

        <div className="visual-stage" aria-label="Ilustrasi preview hasil foto photobooth">
          <div className="stage-label">THE PHOTO EXPERIENCE <span>01 / 03</span></div>
          <div className="photo-stack">
            <div className="photo-card photo-back">
              <div className="photo-placeholder back-image"><span>YOUR</span><b>STORY</b></div>
              <div className="photo-caption"><span>FRAME NO. 02</span><b>GOOD TIMES</b></div>
            </div>
            <div className="photo-card photo-front">
              <div className="photo-placeholder main-image">
                <div className="sun-disc" />
                <div className="silhouette silhouette-one" />
                <div className="silhouette silhouette-two" />
                <div className="image-stamp">S / P</div>
                <span className="image-word">STAY<br />GOLDEN.</span>
              </div>
              <div className="photo-caption"><span>SANDIKALE PHOTOBOOTH</span><b>FRAME NO. 01</b></div>
            </div>
            <div className="floating-tag"><span className="tag-dot" /> INSTANT MEMORIES</div>
            <div className="frame-corner corner-tl" />
            <div className="frame-corner corner-br" />
          </div>
          <div className="stage-bottom"><span>CREATE</span><i /> <span>POSE</span><i /> <span>REMEMBER</span></div>
        </div>
      </section>

      <section className="hardware-panel" aria-label="Status perangkat">
        <div className="hardware-heading">
          <div><span className="panel-kicker">KIOSK HARDWARE</span><h2>PRINTER DETECTION</h2></div>
          <button className="refresh-button" onClick={() => void refreshPrinters()} disabled={printerState === 'checking'}>
            {printerState === 'checking' ? 'MEMERIKSA...' : 'REFRESH PRINTER'}
          </button>
        </div>
        {printerState === 'ready' && (
          <ul className="printer-list">
            {printers.map((printer) => (
              <li key={printer.name}>
                <span className="printer-indicator" />
                <span className="printer-name">{printer.displayName || printer.name}</span>
                {printer.isDefault && <span className="printer-default">DEFAULT</span>}
              </li>
            ))}
          </ul>
        )}
        {printerState === 'empty' && <p className="hardware-message">Belum ada printer terdeteksi. Pasang printer dan pastikan driver sudah terinstal pada komputer kiosk.</p>}
        {printerState === 'error' && <p className="hardware-message">Deteksi printer hanya tersedia pada aplikasi desktop Electron.</p>}
        {printerState === 'checking' && <p className="hardware-message">Memeriksa printer yang dikenali sistem operasi...</p>}
        <p className="hardware-note">Deteksi perangkat belum mengirim perintah cetak. Pengiriman cetak akan diaktifkan setelah antrean dan pengaman anti-duplikasi selesai diuji.</p>
      </section>

      <footer className="footer">
        <div className="footer-brand">SANDIKALE <span>PHOTOBOOTH</span></div>
        <div className="footer-center">A LITTLE SPACE FOR BIG MEMORIES.</div>
        <div className="system-status">
          <span className={db?.ok ? 'status-dot good' : 'status-dot'} />
          <span>{db ? (db.ok ? 'SYSTEM READY' : 'SYSTEM SETUP') : 'CHECKING SYSTEM'}</span>
          <span className="status-detail">{info}</span>
        </div>
      </footer>
    </main>
  );
}
