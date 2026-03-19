import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutModal } from "../../modals/logout-modal/logout-modal";
import { AuthService } from '../../services/auth.service';

interface UserDropDownItem {
	route: string;
	title: string;
}

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

	notifications = 3

	menu: Array<UserDropDownItem> = [
		{
			route: 'profile',
			title: 'Profile'
		},
		{
			route: 'settings',
			title: 'Settings'
		},
		{
			route: 'logout',
			title: 'Logout'
		},
	];

	onUserDropdownItemClick(route: string) {
		switch (route) {
			case 'logout': this.openLogoutModal();
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
