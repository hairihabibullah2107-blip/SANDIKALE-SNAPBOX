import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const schema = z.object({
  APP_ENV: z.enum(['development', 'production']).default('development'),
  ADMIN_PIN: z.string().min(4).default('0000'),
  SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Konfigurasi .env tidak valid:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;

if (config.APP_ENV === 'production' && config.ADMIN_PIN === '0000') {
  console.error('ADMIN_PIN default tidak boleh dipakai di production.');
  process.exit(1);
}
