import { computed, inject, Injectable, signal } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { USER_DATA, USER_SETTINGS } from "../data/constants/UserSettingsConstants";

@Injectable({
    providedIn: 'root'
})
export class MainMenuService {

    private storageService = inject(LocalStorageService);
    permissions = signal<string[]>([]);

    constructor() {
        const userData = this.storageService.getItem<CurrentUser>(USER_DATA);
        this.permissions.set(userData?.permissions ?? []);

        this.initializeDefaultMenu();
    }

    private initializeDefaultMenu(): void {
        this.addMenuItem({
            label: 'Dashboard',
            icon: 'bi-speedometer2',
            active: false,
            route: '/dashboard',
            menuType: 'sidenav',
            order: 1
        });

        this.addMenuItem({
            label: 'Accounts',
            route: '/accounts',
            icon: 'bi-cart',
            menuType: 'sidenav',
            order: 2,
            children: [
                { label: 'Create Account', route: '/accounts/create-account' },
                { label: 'View Accounts', route: '/accounts/view-accounts' },
                { label: 'Import Accounts' }
            ]
        });

        // Add Contacts menu with condition
        this.addMenuItem({
            label: 'Contacts',
            icon: 'bi-box',
            route: '/products',
            menuType: 'sidenav',
            order: 3,
            children: [
                { label: 'Create Contact', route: '/products/lists' },
                { label: 'View Contacts', route: '/products/warehouses' },
                { label: 'Import Contacts', route: '/products/inventories' },
            ]
        });

        // Add Opportunities menu
        this.addMenuItem({
            label: 'Opportunities',
            icon: 'bi bi-emoji-sunglasses-fill',
            menuType: 'sidenav',
            order: 4,
            children: [
                { label: 'Create Opportunity' },
                { label: 'View Opportunities' },
                { label: 'Import Opportunities' }
            ]
        });

        // Add Leads menu with condition
        this.addMenuItem({
            label: 'Leads',
            icon: 'bi bi-grid-3x3-gap-fill',
            menuType: 'sidenav',
            order: 5,
            children: [
                { label: 'Create Lead' },
                { label: 'View Leads' },
                { label: 'Import Leads' }
            ]
        });

        // Add Quote menu
        this.addMenuItem({
            label: 'Quote',
            icon: 'bi bi-grid-3x3-gap-fill',
            menuType: 'sidenav',
            order: 6,
            children: [
                { label: 'Create Quote' },
                { label: 'View Quotes' },
                { label: 'Import Quotes' }
            ]
        });

    }

    private menuSignal = signal<MenuItem[]>([]);

    public menuItems = computed(() => this.menuSignal());

    addMenuItem(menuItem: MenuItem): void {
        const currentMenu = this.menuSignal();
        const existingIndex = currentMenu.findIndex(item => item.label === menuItem.label && item.menuType === menuItem.menuType);

        if (existingIndex !== -1) {
            // Update existing menu item
            const updateMenu = [...currentMenu];
            updateMenu[existingIndex] = { ...updateMenu[existingIndex], ...menuItem };
            this.menuSignal.set(this.sortMenuItems(updateMenu));
        } else {
            // Add new menu item
            const newMenu = [...currentMenu, menuItem];
            this.menuSignal.set(this.sortMenuItems(newMenu));
        }
    }

    removeMenuItem(label: string, menuType: 'sidenav' | 'navbar'): void {
        const currentMenu = this.menuSignal();
        const updateMenu = currentMenu.filter(item => !(item.label === label && item.menuType === menuType));
        this.menuSignal.set(updateMenu);
    }

    getMenuItemsByType(menuType: 'sidenav' | 'navbar'): MenuItem[] {
        return this.menuSignal().filter(item => item.menuType === menuType);
    }

    updateMenuItem(label: string, menuType: 'sidenav' | 'navbar', updates: Partial<MenuItem>): void {
        const currentMenu = this.menuSignal();
        const index = currentMenu.findIndex(item => item.label === label && item.menuType === menuType);

        if (index !== -1) {
            const updateMenu = [...currentMenu];
            updateMenu[index] = { ...updateMenu[index], ...updates };
            this.menuSignal.set(this.sortMenuItems(updateMenu));
        }
    }

    clearMenuItems(menuType?: 'sidenav' | 'navbar'): void {
        if (menuType) {
            const currentMenu = this.menuSignal();
            const updatedMenu = currentMenu.filter(item => item.menuType !== menuType);
            this.menuSignal.set(updatedMenu);
        } else {
            this.menuSignal.set([]);
        }
    }

    private sortMenuItems(items: MenuItem[]): MenuItem[] {
        return items.sort((a, b) => (a.order || 999) - (b.order || 999));
    }

    hasReadTenantsPermission(permissions: string[]): boolean {
        return permissions?.some(permission => permission === "Permission.Tenants.Read") ?? false;
    }

    hasReadUsersPermission(permissions: string[]): boolean {
        return permissions?.some(permission => permission === "Permission.Users.Read") ?? false;
    }

    private isFeatureEnabled(feature: string): boolean {
        const userSettings = this.getUserSettings();
        // Implement your feature flag logic here
        return userSettings?.enabledFeatures?.includes(feature) ?? true;
    }

    updateChildrenWithConditions(
        parentLabel: string,
        menuType: 'sidenav' | 'navbar',
        childrenConfig: Array<{
            child: MenuItem,
            condition: () => boolean
        }>
    ): void {
        const validChildren = childrenConfig
            .filter(config => config.condition())
            .map(config => config.child);

            const currentMenu = this.menuSignal();
            const parentIndex = currentMenu.findIndex(
                item => item.label === parentLabel && item.menuType === menuType
            );

            if (parentIndex !== -1) {
                const updatedMenu = [...currentMenu];
                updatedMenu[parentIndex] = {
                    ...updatedMenu[parentIndex],
                    children: validChildren
                };

                this.menuSignal.set(this.sortMenuItems(updatedMenu));
            }
    }

    initializeSettingsMenu(): void {
        this.addMenuItem({
            label: 'Settings',
            menuType: 'navbar',
            order: 1,
            children: []
        });

        this.updateChildrenWithConditions('Settings', 'navbar', [
            {
                child: { label: 'Profile', route: '/profile' },
                condition: () => true
            },
            {
                child: { label: 'Security', route: '/security' },
                condition: () => true
            },
            {
                child: { label: 'Tenants', route: '/tenants' },
                condition: () => true
            },
            {
                child: { label: 'Logout', route: '/logout' },
                condition: () => true
            }
        ]);
    }

    getUserData(): CurrentUser | null {
        return this.storageService.getItem<CurrentUser>(USER_DATA) ?? null;
    }

    getUserSettings(): UserSettings {
       return this.storageService.getItem<UserSettings>(USER_SETTINGS)!;
    }

    saveUserSettings(userSettings: UserSettings): void {
        this.storageService.setItem(USER_SETTINGS, userSettings);
    }

}