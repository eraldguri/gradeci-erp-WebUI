import { Component, inject, Input, signal } from '@angular/core';
import { MainMenuService } from '../../services/main-menu.service';

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

	menuItems = this.mainMenuService.menuItems;

	toggleItem(item: MenuItem): void {
		if (item.children?.length) {
			item.expanded = !item.expanded;
		} else {
			this.setActive(item);
		}
	}

	selectChild(child: ChildItem, parent: MenuItem): void {
		this.clearActiveStates();

		child.active = true;
		parent.active = true;
		parent.expanded = true;
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
		console.log('Navigating to:', item.route);
		this.menuItems().forEach(i => {
			i.active
		})
	}

}
