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
            route: '/dashboard',
            menuType: 'sidenav'
        },
        {
            label: 'Accounts',
            route: '/accounts',
            icon: 'bi-cart',
            menuType: 'sidenav',
            children: [
                { label: 'Create Account', route: '/accounts/create-account' },
                { label: 'View Accounts', route: '/accounts/view-accounts' },
                { label: 'Import Accounts' }
            ]
        },
        {
            label: 'Contacts',
            icon: 'bi-box',
            route: '/products',
            menuType: 'sidenav',
            children: [
                { label: 'Create Contact', route: '/products/lists' },
                { label: 'View Contacts', route: '/products/warehouses' },
                { label: 'Import Contacts', route: '/products/inventories' },
            ]
        },
        {
            label: 'Opportunities',
            icon: 'bi bi-emoji-sunglasses-fill',
            menuType: 'sidenav',
            children: [
                { label: 'Create Opportunity' },
                { label: 'View Opportunities' },
                { label: 'Import Opportunities' }
            ]
        },
        {
            label: 'Leads',
            icon: 'bi bi-grid-3x3-gap-fill',
            menuType: 'sidenav',
            children: [
                { label: 'Create Lead' },
                { label: 'View Leads' },
                { label: 'Import Leads' }
            ]
        },
        {
            label: 'Quote',
            icon: 'bi bi-grid-3x3-gap-fill',
            menuType: 'sidenav',
            children: [
                { label: 'Create Quote' },
                { label: 'View Quotes' },
                { label: 'Import Quotes' }
            ]
        },
        {
            label: 'Settings',
            menuType: 'navbar',
            children: [
                { 
                    label: 'Profile',
                    route: '/profile'
                },
                {
                    label: 'Logout',
                    route: '/logout'
                }
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