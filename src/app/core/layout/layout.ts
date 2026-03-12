import { Component, signal } from '@angular/core';
import { Navbar } from "./navbar/navbar";
import { Sidebar } from "./sidebar/sidebar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-layout',
  imports: [Navbar, Sidebar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
	sidebarCollapsed = signal(false);
  isMobileSidebarOpen = signal(false);

	toggleSidebar() {
		this.sidebarCollapsed.update(v => !v);
	}

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }
}
