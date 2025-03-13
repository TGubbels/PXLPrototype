import { Injectable } from '@angular/core';

declare global {
  interface Window {
    electronAPI?: {
      store: {
        get: (key: string) => string | null;
        set: (key: string, value: string) => void;
        remove: (key: string) => void;
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isElectron: boolean = window.electronAPI !== undefined;

  setItem(key: string, value: string): void {
    if (this.isElectron) {
      window.electronAPI?.store.set(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    if (this.isElectron) {
      return window.electronAPI?.store.get(key) ?? null;
    } else {
      return localStorage.getItem(key);
    }
  }

  removeItem(key: string): void {
    if (this.isElectron) {
      window.electronAPI?.store.remove(key);
    } else {
      localStorage.removeItem(key);
    }
  }
}