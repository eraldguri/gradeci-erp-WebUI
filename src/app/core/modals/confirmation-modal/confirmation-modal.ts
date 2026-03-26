import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss',
})
export class ConfirmationModal {
	@Input() title: string = 'Confirm';
	@Input() description: string = 'Are you sure?';
	@Input() confirmButtonText: string = 'Confirm';
	@Input() confirmButtonClass: string = 'btn-primary';

    activeModal = inject(NgbActiveModal);
}
