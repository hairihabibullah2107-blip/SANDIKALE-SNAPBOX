import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { config } from './config';
import { logger } from './logger';
import { registerIpc } from '../ipc';

const devUrl = process.env.ELECTRON_RENDERER_URL;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 800,
    fullscreen: config.APP_ENV === 'production',
    kiosk: config.APP_ENV === 'production',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: config.APP_ENV !== 'production',
    },
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://') && !(devUrl && url.startsWith(devUrl))) e.preventDefault();
  });
  win.webContents.on('render-process-gone', (_e, d) => logger.error('renderer crash', d));
  if (devUrl) win.loadURL(devUrl); else win.loadFile(join(__dirname, '../../dist/index.html'));
}

process.on('uncaughtException', (err) => logger.error('uncaughtException', String(err)));
process.on('unhandledRejection', (r) => logger.error('unhandledRejection', String(r)));

if (!app.requestSingleInstanceLock()) app.quit();

app.whenReady().then(() => {
  registerIpc();
  createWindow();
  logger.info('app siap', { env: config.APP_ENV });
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());
});
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
