import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../core/services/user.service';
import { ApiResponse } from '../../../../core/data/ApiResponse';
import { ToastService } from '../../../../core/widgets/toast/toast.service';

@Component({
  selector: 'app-user-roles-modal',
  imports: [],
  templateUrl: './user-roles-modal.html',
  styleUrl: './user-roles-modal.scss',
})
export class UserRolesModal {
	activeModal = inject(NgbActiveModal);
	private userService = inject(UserService);
	private toastService = inject(ToastService);
	@Input() userId: string = '';

	userRoles = signal<UserRolesResponse[]>([]);
	originalRoles = signal<UserRolesResponse[]>([]);

	ngOnInit() {
		if (this.userId) {
			this.getUserRoles(this.userId);
		}
	}

	getUserRoles(userId: string): void {
		this.userService.getUserRoles(userId).subscribe({
			next: (response: ApiResponse<UserRolesResponse[]>) => {
				if (response?.data) {
					this.userRoles.set(response.data);

					this.originalRoles.set(
						JSON.parse(JSON.stringify(response.data))
					);
				}
			},
			error: (error) => {
				console.error('Error getting user roles', error);
			},
			complete: () => {
				// Any cleanup or final actions after the request completes
			}
		});
	}

	onToggle(role: UserRolesResponse, isChecked: boolean) {
		this.userRoles.update(roles =>
			roles.map(r =>
				r.roleId === role.roleId
					? { ...r, isAssigned: isChecked }
					: r
			)
		);
	}

	getChanges() {
		const original = this.originalRoles();

		return this.userRoles()
			.filter((role, i) =>
				role.isAssigned !== original[i]?.isAssigned
			)
			.map(role => ({
				roleId: role.roleId,
				isAssigned: role.isAssigned
		}));
	}

	get hasChanges(): boolean {
		return this.getChanges().length > 0;
	}

	onSave(): void {
		const changes = this.getChanges();

		if (!changes.length) {
			this.activeModal.dismiss('No changes to save');
			return;
		}

		this.updateRoles();
	}

	private updateRoles(): void {
		const request: UpdateUserRoles = {
			userRoles: this.userRoles().map(role => ({
				roleId: role.roleId,
				name: role.name,
				description: role.description,
				isAssigned: role.isAssigned
			}))
		};
		this.userService.updateUserRoles(this.userId, request).subscribe({
			next: (response: ApiResponse<string>) => {
				if (response && response.isSuccessful) {
					this.toastService.show('User roles updated successfully');
					this.activeModal.close('Roles updated');
				} else {
					this.toastService.show('Failed to update user roles', 'error');
				}
			},
			error: (error) => {
				this.toastService.show('Error updating user roles', 'error');
			}
		});
	}

}
