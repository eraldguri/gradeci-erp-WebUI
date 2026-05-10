import { Component, EventEmitter, inject, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutModal } from "../../modals/logout-modal/logout-modal";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MainMenuService } from '../../services/main-menu.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { USER_DATA } from '../../data/constants/UserSettingsConstants';

@Component({
  selector: 'app-navbar',
  imports: [NgbDropdownModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
	@Output() toggleSidebar = new EventEmitter<void>()
	@Input() userData: CurrentUser | null = null;

	private modalService = inject(NgbModal);
	private authService = inject(AuthService);
	private menuService = inject(MainMenuService);
	private router = inject(Router);
	private storageService = inject(LocalStorageService);

	menuItems = signal<MenuItem[]>([]);
	permissions = signal<string[]>([]);

	ngOnInit(): void {
		const userData = this.storageService.getItem<CurrentUser>(USER_DATA);

		if (userData) {
			this.permissions.set(userData?.permissions ?? []);

			this.initializeSettingsMenu();
			this.menuItems.set(this.menuService.menuItems());
		} else {
			this.permissions.set([]);
			this.menuItems.set([]);
		}
		
	}

	initializeSettingsMenu(): void {
        this.menuService.addMenuItem({
            label: 'Settings',
            menuType: 'navbar',
            order: 1,
            children: []
        });

        this.menuService.updateChildrenWithConditions('Settings', 'navbar', [
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
                condition: () =>  this.menuService.hasReadTenantsPermission(this.permissions())
            },
			{
				child: { label: 'Users', route: '/users' },
				condition: () => this.menuService.hasReadUsersPermission(this.permissions())
			},
			{
				child: { label: 'Roles', route: '/roles' },
				condition: () => this.menuService.hasReadRolesPermission(this.permissions())
			},
			{
				child: { label: 'Company', route: '/company' },
				condition: () => this.menuService.hasReadCompanyPermission(this.permissions())
			},
            {
                child: { label: 'Logout', route: '/logout' },
                condition: () => true
            }
        ]);
    }

	onUserDropdownItemClick(route: string) {
		route === '/logout' 
		? this.openLogoutModal() 
		: this.router.navigate([route]);
	}

	openLogoutModal(): void {
		this.modalService.open(LogoutModal, { centered: true, size: 'md' }).result.then(
			(result) => {
				if (result === 'confirm') {
					this.authService.logout();
				}
			},
			() => {
				//dismiss
			}
		);
	}
	
}
