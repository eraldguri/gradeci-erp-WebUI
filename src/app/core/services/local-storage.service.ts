import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    watchItem<T>(key: string, defaultValue: T) {
        const storageSignal = signal<T>(this.getItem<T>(key) ?? defaultValue);

        if (this.isBrowser) {
            window.addEventListener('storage', (event) => {
                if (event.key === key) {
                    storageSignal.set(event.newValue ? JSON.parse(event.newValue) : defaultValue)
                }
            });
        }

        return storageSignal;
    }

    setItem<T>(key: string, value: T): void {
        if (this.isBrowser) {
            try {
                const serializedValue = JSON.stringify(value);
                localStorage.setItem(key, serializedValue);
            } catch (error) {
                console.error("Error saving to localStorage", error);
            }
        }
    }

    getItem<T>(key: string): T | null {
        if (this.isBrowser) {
            const item = localStorage.getItem(key);
            try {
                return item ? (JSON.parse(item) as T) : null;
            } catch(error) {
                console.error("Error parsing localStorage item", error);
                return null;
            }
        }
        return null;
    }

    removeItem(key: string): void {
        if (this.isBrowser) {
            localStorage.removeItem(key);
        }
    }

    clear(): void {
        if (this.isBrowser) {
            localStorage.clear();
        }
    }
}