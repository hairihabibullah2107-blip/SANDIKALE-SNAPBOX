import { app } from 'electron';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { config } from './config';

const levels = { debug: 10, info: 20, warn: 30, error: 40 } as const;
type Level = keyof typeof levels;

function logFile(): string {
  const dir = join(app.getPath('userData'), 'logs');
  mkdirSync(dir, { recursive: true });
  return join(dir, `${new Date().toISOString().slice(0, 10)}.log`);
}

function write(level: Level, msg: string, extra?: unknown) {
  if (levels[level] < levels[config.LOG_LEVEL]) return;
  const line = JSON.stringify({ t: new Date().toISOString(), level, msg, extra });
  console.log(line);
  try { appendFileSync(logFile(), line + '\n'); } catch { /* logging tidak boleh menjatuhkan app */ }
}

export const logger = {
  debug: (m: string, e?: unknown) => write('debug', m, e),
  info: (m: string, e?: unknown) => write('info', m, e),
  warn: (m: string, e?: unknown) => write('warn', m, e),
  error: (m: string, e?: unknown) => write('error', m, e),
};
