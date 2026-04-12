import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {

	private router = inject(Router);

	onAddProductClick(): void {
		this.router.navigate(['/inventory/add-product']);
	}
}
