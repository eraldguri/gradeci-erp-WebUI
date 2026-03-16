import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';

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
export class Navbar implements OnInit {
	@Output() toggleSidebar = new EventEmitter<void>()
	@Input() userData: CurrentUser | null = null;

	private storage = inject(LocalStorageService);
	private router = inject(Router);

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
			case 'logout': this.logoutUser();
		}
	}

	private logoutUser() {
		this.storage.clear();
		this.router.navigate(['/login']);
	}

	ngOnInit(): void {
   	 	console.log(this.userData);
  	}	
}
