import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProductCategoryModal } from './add-product-category-modal/add-product-category-modal';

@Component({
  selector: 'app-product-config-categories-tab',
  imports: [],
  templateUrl: './product-config-categories-tab.html',
  styleUrl: './product-config-categories-tab.scss',
})
export class ProductConfigCategoriesTab {

  	private modalService = inject(NgbModal);

	addCategory(): void {
		const modalRef = this.modalService.open(AddProductCategoryModal, {
			size: 'xl'
		});
	}
}
