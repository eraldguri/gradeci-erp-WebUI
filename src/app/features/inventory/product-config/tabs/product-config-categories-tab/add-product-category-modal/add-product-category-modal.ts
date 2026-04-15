import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-product-category-modal',
  imports: [],
  templateUrl: './add-product-category-modal.html',
  styleUrl: './add-product-category-modal.scss',
})
export class AddProductCategoryModal {
	activeModal = inject(NgbActiveModal);
}
