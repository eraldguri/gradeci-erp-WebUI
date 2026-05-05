import { Component, inject, OnInit, signal } from '@angular/core';
import { RoleResponse } from '../../../core/data/roles/RoleResponse';
import { RolesService } from '../../../core/services/roles.service';
import { ApiResponse } from '../../../core/data/ApiResponse';
import { ToastService } from '../../../core/widgets/toast/toast.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionManagementModal } from './permission-management-modal/permission-management-modal';
import { AddRoleModal } from './add-role-modal/add-role-modal';
import { RoleStateService } from './services/role-state.service';
import { ConfirmationModal } from '../../../core/modals/confirmation-modal/confirmation-modal';

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
	private roleStateService = inject(RoleStateService);

	roles = signal<RoleResponse[]>([]);
	isLoading = signal(false);

	ngOnInit(): void {
		this.getRoles();

		this.roleStateService.roles$.subscribe((roles) => {
			this.roles.set(roles);
		});
	}

	getRoles(): void {
		this.isLoading.set(true);
		
		this.roleService.getAllRoles().subscribe({
			next: (response: ApiResponse<RoleResponse[]>) => {
				this.isLoading.set(false);

				if (response?.data) {
					this.roleStateService.setRoles(response.data);
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

	addRole(): void {
		const modalRef = this.modalService.open(AddRoleModal, { centered: true, size: 'lg' });

		modalRef.result.then(
			(newRole) => {
				if (newRole) {
					this.roleStateService.addRole(newRole);
					console.log('New role added:', newRole);
				}
			},
		);

		modalRef.result.catch(() => {
			// dismissed
		});
	}

	openDeleteRoleDialog(roleId: string, roleName: string): void {
		console.log('Opening delete dialog for role:', roleId, roleName);
		const modalRef = this.modalService.open(ConfirmationModal, { centered: true });

		modalRef.componentInstance.title = 'Delete Role';
		modalRef.componentInstance.description = `Are you sure you want to delete ${roleName}?`;
		modalRef.componentInstance.confirmButtonText = 'Delete';
		modalRef.componentInstance.confirmButtonClass = 'btn-danger';

		modalRef.result.then((result) => {
			if (result === 'confirm') {
				this.deleteRole(roleId);
			}
		}).catch(() => {});
	}

	deleteRole(roleId: string): void {
		this.roleService.deleteRole(roleId).subscribe({
			next: (response: ApiResponse<string>) => {
				this.toastService.show('Role deleted successfully.', 'success');
				this.roleStateService.deleteRole(roleId);
				console.log('Role deleted:', roleId);
			},
			error: (error) => {
				this.toastService.show('Failed to delete role.', 'error');
				console.error('Failed to delete role', error);
			}
		});
	}
}
