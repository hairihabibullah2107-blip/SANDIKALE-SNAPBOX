import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { z } from 'zod';
import { config } from '../main/config';
import { logger } from '../main/logger';
import { dbHealth } from '../database/supabase';

function trusted(e: IpcMainInvokeEvent): boolean {
  const rawUrl = e.senderFrame?.url;
  if (!rawUrl) return false;
  try {
    const sender = new URL(rawUrl);
    if (sender.protocol === 'file:') return true;
    return config.APP_ENV === 'development' && sender.origin === 'http://localhost:5173';
  } catch {
    return false;
  }
}

function handle<T>(
  channel: string,
  schema: z.ZodType<T>,
  fn: (p: T, e: IpcMainInvokeEvent) => unknown | Promise<unknown>,
) {
  ipcMain.handle(channel, async (e, payload) => {
    if (!trusted(e)) {
      logger.warn('IPC ditolak: sender tidak dipercaya', { channel });
      throw new Error('forbidden');
    }
    const p = schema.safeParse(payload);
    if (!p.success) {
      logger.warn('IPC payload tidak valid', { channel });
      throw new Error('invalid payload');
    }
    try {
      return await fn(p.data, e);
    } catch (err) {
      logger.error(`IPC ${channel} gagal`, String(err));
      throw new Error('internal error');
    }
  });
}

export function registerIpc() {
  handle('app:ping', z.object({ message: z.string().max(100) }), (p) => ({
    pong: p.message,
    at: new Date().toISOString(),
  }));
  handle('app:info', z.undefined(), () => ({
    env: config.APP_ENV,
    version: process.env.npm_package_version ?? '0.1.0',
  }));
  handle('db:health', z.undefined(), () => dbHealth());

  // Reads printers installed through the operating-system drivers.
  // This only discovers devices; it does not submit a print job.
  handle('printer:list', z.undefined(), async (_p, e) => {
    const printers = await e.sender.getPrintersAsync();
    return printers.map((printer) => ({
      name: printer.name,
      displayName: printer.displayName,
      description: printer.description,
      isDefault: printer.isDefault,
      status: printer.status,
    }));
  });
}
