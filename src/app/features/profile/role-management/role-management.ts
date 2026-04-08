import { Component, inject, OnInit, signal } from '@angular/core';
import { RoleResponse } from '../../../core/data/roles/RoleResponse';
import { RolesService } from '../../../core/services/roles.service';
import { ApiResponse } from '../../../core/data/ApiResponse';
import { ToastService } from '../../../core/widgets/toast/toast.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionManagementModal } from './permission-management-modal/permission-management-modal';

@Component({
  selector: 'app-role-management',
  imports: [NgbDropdownModule],
  templateUrl: './role-management.html',
  styleUrl: './role-management.scss',
})
export class RoleManagement implements OnInit {
	private roleService = inject(RolesService);
	private toastService = inject(ToastService);
	private modalService = inject(NgbModal);

	roles = signal<RoleResponse[]>([]);
	isLoading = signal(false);

	ngOnInit(): void {
		this.getRoles();
	}

	getRoles(): void {
		this.isLoading.set(true);
		
		this.roleService.getAllRoles().subscribe({
			next: (response: ApiResponse<RoleResponse[]>) => {
				this.isLoading.set(false);

				if (response?.data) {
					this.roles.set(response.data);
				}

				if (response && response.isSuccessful === false) {
					this.toastService.show('Failed to load roles.', 'error');
				}
			},
			error: (error) => {
				this.isLoading.set(false);
				this.toastService.show('Failed to load roles.', 'error');
			},
			complete: () => {
				this.isLoading.set(false);
			}
		});
	}

	viewPermissions(roleId: string) {
		const modalRef = this.modalService.open(PermissionManagementModal, {
			size: 'xl'
		});
		modalRef.componentInstance.roleId = roleId;
	}
}
