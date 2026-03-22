import { Component, inject, Input, signal } from '@angular/core';
import { MainMenuService } from '../../services/main-menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
	
	@Input() collapsed = false;
	sidebarWidth = signal(260);
	private mainMenuService = inject(MainMenuService);
	private router = inject(Router);

	menuItems = this.mainMenuService.menuItems;

	toggleItem(item: MenuItem): void {
		if (item.children?.length) {
			item.expanded = !item.expanded;
		} else {
			this.setActive(item);

			if (item.children === undefined) {
				this.router.navigate([item.route]);
			}
		}
	}

	selectChild(child: ChildItem, parent: MenuItem): void {
		this.clearActiveStates();

		child.active = true;
		parent.active = true;
		parent.expanded = true;

		this.router.navigate([child.route]);

	}

	setActive(item: MenuItem): void {
		this.clearActiveStates();
		item.active = true;
	}

	clearActiveStates(): void {
		this.menuItems().forEach(item => {
			item.active = false;
			if (item.children) {
				item.children.forEach((child: ChildItem) => child.active = false);
			}
		});
	}

	toggleChildMenu(item: MenuItem): void {
		if (item.children?.length) {
			item.expanded = !item.expanded;
		} else {
			this.navigateTo(item);
		}
	}

	navigateTo(item: MenuItem): void {
		this.menuItems().forEach(i => {
			i.active
		})
	}

}
