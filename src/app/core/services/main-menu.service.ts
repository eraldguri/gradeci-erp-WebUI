import { computed, inject, Injectable, signal } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { USER_SETTINGS } from "../data/constants/UserSettingsConstants";

@Injectable({
    providedIn: 'root'
})
export class MainMenuService {

    private storageService = inject(LocalStorageService);

    private menuSignal = signal<MenuItem[]>([
        {
            label: 'Dashboard',
            icon: 'bi-speedometer2',
            active: false,
            route: '/dashboard'
        },
        {
            label: 'Accounts',
            icon: 'bi-cart',
            children: [
                { label: 'Create Account' },
                { label: 'View Accounts' },
                { label: 'Import Accounts' }
            ]
        },
        {
            label: 'Contacts',
            icon: 'bi-box',
            route: '/products',
            children: [
                { label: 'Create Contact', route: '/products/lists' },
                { label: 'View Contacts', route: '/products/warehouses' },
                { label: 'Import Contacts', route: '/products/inventories' },
            ]
        },
        {
            label: 'Opportunities',
            icon: 'bi bi-emoji-sunglasses-fill',
            children: [
                { label: 'Create Opportunity' },
                { label: 'View Opportunities' },
                { label: 'Import Opportunities' }
            ]
        },
        {
            label: 'Leads',
            icon: 'bi bi-grid-3x3-gap-fill',
            children: [
                { label: 'Create Lead' },
                { label: 'View Leads' },
                { label: 'Import Leads' }
            ]
        },
        {
            label: 'Quote',
            icon: 'bi bi-grid-3x3-gap-fill',
            children: [
                { label: 'Create Quote' },
                { label: 'View Quotes' },
                { label: 'Import Quotes' }
            ]
        }
    ]);

    public menuItems = computed(() => this.menuSignal());

    getUserSettings(): UserSettings {
       return this.storageService.getItem<UserSettings>(USER_SETTINGS)!;
    }

    saveUserSettings(userSettings: UserSettings): void {
        this.storageService.setItem(USER_SETTINGS, userSettings);
    }
}