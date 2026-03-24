import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutModal } from "../../modals/logout-modal/logout-modal";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MainMenuService } from '../../services/main-menu.service';

@Component({
  selector: 'app-navbar',
  imports: [NgbDropdownModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
	@Output() toggleSidebar = new EventEmitter<void>()
	@Input() userData: CurrentUser | null = null;

	private modalService = inject(NgbModal);
	private authService = inject(AuthService);
	private menuService = inject(MainMenuService);
	private router = inject(Router);

	menuItems = this.menuService.menuItems;

	onUserDropdownItemClick(route: string) {
		switch (route) {
			case '/profile' : 
				this.router.navigate([route]);
				break;
			case '/security': 
				this.router.navigate([route]);
				break;
			case '/logout': 
				this.openLogoutModal();
				break;
		}
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
