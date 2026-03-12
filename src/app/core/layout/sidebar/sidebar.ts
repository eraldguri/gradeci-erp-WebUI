import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
	@Input() collapsed = false;
	sidebarWidth = signal(260);

	menu = [
    {
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      route: '/dashboard'
    },
    {
      label: 'Sales',
      icon: 'bi-cart',
      children: [
        { label: 'Orders' },
        { label: 'Invoices' },
        { label: 'Customers' }
      ]
    },
    {
      label: 'Inventory',
      icon: 'bi-box',
      children: [
        { label: 'Products' },
        { label: 'Stock' }
      ]
    }
  ];

}
