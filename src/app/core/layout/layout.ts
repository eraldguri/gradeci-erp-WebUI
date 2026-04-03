import { Component, inject, OnInit, signal } from '@angular/core';
import { Navbar } from "./navbar/navbar";
import { Sidebar } from "./sidebar/sidebar";
import { Router, RouterOutlet } from "@angular/router";
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { EMAIL_ADDRESS, JwtPayload, MOBILE_PHONE, NAME, NAME_IDENTIFIER, ROLE, SURNAME } from '../data/JwtPayload';
import { MainMenuService } from '../services/main-menu.service';
import { USER_DATA, USER_PREFS } from '../data/constants/UserSettingsConstants';
import { Toast } from "../widgets/toast/toast";

@Component({
  selector: 'app-layout',
  imports: [Navbar, Sidebar, RouterOutlet, Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
	sidebarCollapsed = signal(false);
  	isMobileSidebarOpen = signal(false);

	private authService = inject(AuthService);
	private storage = inject(LocalStorageService);
	private mainMenuService = inject(MainMenuService);
	private router = inject(Router);

	user = signal<CurrentUser | null>(null);

	ngOnInit(): void {
		this.getUsetData();

		if (this.mainMenuService.getUserSettings() !== null) {
			const collapsed = this.mainMenuService.getUserSettings().sidebarCollapsed;
			this.sidebarCollapsed.set(collapsed);
		} else {
			this.sidebarCollapsed.set(false);
		}
		
	}
	
	getUsetData() {
		const userPrefs = this.storage.getItem<CurrentUser>(USER_DATA);

		if (userPrefs) {
			this.user.set(userPrefs);
		}
	}

	toggleSidebar() {
		this.sidebarCollapsed.update(v => !v);

		const userSettings: UserSettings = {
			sidebarCollapsed: this.sidebarCollapsed()
		}
		this.mainMenuService.saveUserSettings(userSettings);
	}

	toggleMobileSidebar() {
		this.isMobileSidebarOpen.update(v => !v);
	}
}
