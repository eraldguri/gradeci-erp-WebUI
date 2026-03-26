import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TenantService } from '../../../core/services/tenant.service';
import { ToastService } from '../../../core/widgets/toast/toast.service';
import { ApiResponse } from '../../../core/data/ApiResponse';
import { AddTenantModal } from './add-tenant-modal/add-tenant-modal';
import { TenantResponse } from '../../../core/data/tenancy/TenantResponse';
import { ConfirmationModal } from '../../../core/modals/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-tenant-management',
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './tenant-management.html',
  styleUrl: './tenant-management.scss',
})
export class TenantManagement {
    private tenantService = inject(TenantService);
	private modalService = inject(NgbModal);

	private toastService = inject(ToastService);

	tenants = signal<TenantResponse[]>([]);
	isLoading = signal(false);

	ngOnInit(): void {
		this.getTenants();
	}

	getTenants(): void {
		this.isLoading.set(true);

		this.tenantService.getTenants().subscribe({
			next: (response: ApiResponse<TenantResponse[]>) => {
				this.tenants.set(response?.data ?? []);

				if (response && response.isSuccessful === false) {
					this.toastService.show('Failed to load tenants.', 'error');
				}
			},
			error: (error) => {
				this.toastService.show('Failed to load tenants.', 'error');
				console.error('Error getting tenants', error);
				this.isLoading.set(false);
			},
			complete: () => {
				this.isLoading.set(false);
			}
		});
	}

	openAddTenantDialog(): void {
		const modalRef = this.modalService.open(AddTenantModal, { centered: true, size: 'lg' });

		modalRef.result.then(
			(result) => {
				if (result === 'confirm') {
					this.getTenants();
				}
			},
			() => {
				// dismissed
			}
		);
	}

	openActivateOrDeativateTenantDialog(tenant: TenantResponse): void {
		const isActivating = !tenant.isActive;
		
		const modalRef = this.modalService.open(ConfirmationModal, { centered: true });

		modalRef.componentInstance.title = `${isActivating ? 'Activate' : 'Deactivate'} Tenant`;
		modalRef.componentInstance.description = `Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} ${tenant.name}?`;
		modalRef.componentInstance.confirmButtonText = isActivating ? 'Activate' : 'Deactivate';
		modalRef.componentInstance.confirmButtonClass = isActivating ? 'btn-success' : 'btn-danger';

		modalRef.result.then((result) => {
			if (result === 'confirm') {
				if (isActivating) {
					this.deactivateTenant(tenant);
				} else {
					this.activateTenant(tenant);
				}
			}
		}).catch(() => {});
	}

	activateTenant(tenant: TenantResponse): void {
		this.tenantService.activateTenant(tenant.identifier).subscribe({
			next: (response: ApiResponse<string>) => {
				if (response && response.isSuccessful) {
					this.toastService.show(`Tenant ${tenant.name} activated successfully`);
				} else {
					console.log(response.messages);
				}
			},
			error: (error) => {
				this.toastService.show('Failed to activate Tenant. Please try again later.');
				console.log(error);
			}
		});
	}

	deactivateTenant(tenant: TenantResponse): void {
		this.tenantService.deactivateTenant(tenant.identifier).subscribe({
			next: (response: ApiResponse<string>) => {
				if (response && response.isSuccessful) {
					this.toastService.show(`Tenant ${tenant.name} deactivated successfully`);
				} else {
					console.log(response.messages);
				}
			},
			error: (error) => {
				this.toastService.show('Failed to deactivate Tenant. Please try again later.');
				console.log(error);
			}
		});
	}

}
