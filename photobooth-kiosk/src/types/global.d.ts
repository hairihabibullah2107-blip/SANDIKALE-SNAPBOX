export {};
declare global {
  interface Window {
    kiosk: {
      ping(message: string): Promise<{ pong: string; at: string }>;
      info(): Promise<{ env: string; version: string }>;
      dbHealth(): Promise<{ ok: boolean; detail: string }>;
    };
  }
}
