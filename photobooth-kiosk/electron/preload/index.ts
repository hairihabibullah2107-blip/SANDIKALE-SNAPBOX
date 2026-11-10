import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('kiosk', {
  ping: (message: string) => ipcRenderer.invoke('app:ping', { message }),
  info: () => ipcRenderer.invoke('app:info'),
  dbHealth: () => ipcRenderer.invoke('db:health'),
  listPrinters: () => ipcRenderer.invoke('printer:list'),
});
