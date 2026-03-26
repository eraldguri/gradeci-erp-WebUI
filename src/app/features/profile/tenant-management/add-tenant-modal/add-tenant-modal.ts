import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateTenant } from '../../../../core/data/tenancy/CreateTenant';
import { TenantService } from '../../../../core/services/tenant.service';
import { ToastService } from '../../../../core/widgets/toast/toast.service';

@Component({
  selector: 'app-add-tenant-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-tenant-modal.html',
  styleUrl: './add-tenant-modal.scss',
})
export class AddTenantModal {
	activeModal = inject(NgbActiveModal);

	private fb = inject(FormBuilder);
	private tenantService = inject(TenantService);
	private toastService = inject(ToastService);

	isSubmitting = signal(false);

	form = this.fb.group({
		identifier: ['', Validators.required],
		name: ['', Validators.required],
		connectionString: [''],
		email: ['', [Validators.required, Validators.email]],
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		// datetime-local gives a string like "2026-03-26T10:16" (no timezone)
		validUpTo: ['', Validators.required],
		isActive: [false]
	});

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.isSubmitting.set(true);

		const raw = this.form.value;
		const validUpToIso = raw.validUpTo ? new Date(raw.validUpTo).toISOString() : '';

		const payload: CreateTenant = {
			identifier: raw.identifier ?? '',
			name: raw.name ?? '',
			connectionString: raw.connectionString ?? '',
			email: raw.email ?? '',
			firstName: raw.firstName ?? '',
			lastName: raw.lastName ?? '',
			validUpTo: validUpToIso,
			isActive: raw.isActive ?? false
		};

		this.tenantService.addTenant(payload).subscribe({
			next: () => {
				this.toastService.show('Tenant added successfully!', 'success');
				this.activeModal.close('confirm');
			},
			error: (err) => {
				console.error('Failed to add tenant', err);
				this.toastService.show('Failed to add tenant', 'error');
				this.isSubmitting.set(false);
			},
			complete: () => {
				this.isSubmitting.set(false);
			}
		});
	}
}
