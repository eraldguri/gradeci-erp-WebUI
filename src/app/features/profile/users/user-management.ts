import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/widgets/toast/toast.service';
import { ApiResponse } from '../../../core/data/ApiResponse';

import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserModal } from './add-user-modal/add-user-modal';
import { UserStateService } from './services/user-state.service';
import { UserRolesModal } from './user-roles-modal/user-roles-modal';
import { TablePagination } from "../../../core/widgets/table-pagination/table-pagination";
import { ConfirmationModal } from '../../../core/modals/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-users',
  imports: [NgbDropdownModule, TablePagination],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement implements OnInit {
	private userService = inject(UserService);
	private userStateService = inject(UserStateService);
	private modalService = inject(NgbModal);
	private toastService = inject(ToastService);

	users = signal<User[]>([]);
	isLoading = signal(false);

	currentPage = signal(1);
	pageSize = signal(10);

	paginatedUsers = computed(() => {
		const startIndex = (this.currentPage() - 1) * this.pageSize();
		const endIndex = startIndex + this.pageSize();
		return this.users().slice(startIndex, endIndex);
	});
	totalItems = computed(() => this.users().length);

	ngOnInit(): void {
		this.getUsers();

		this.userStateService.users$.subscribe(users => {
			this.users.set(users);
		});
	}

	getUsers(): void {
		this.isLoading.set(true);

		this.userService.getAllUsers().subscribe({
			next: (response: ApiResponse<User[]>) => {

				if (response?.data) {
					this.userStateService.setUsers(response.data);
				}

				if (response && response.isSuccessful === false) {
					this.toastService.show('Failed to load users.', 'error');
				}
			},
			error: (error) => {
				this.toastService.show('Failed to load users.', 'error');
				console.error('Error getting users', error);
				this.isLoading.set(false);
			},
			complete: () => {
				this.isLoading.set(false);
			}
		})
	}

	openRegisterUserDialog(): void {
		const modalRef = this.modalService.open(AddUserModal, { centered: true, size: 'lg' });

		modalRef.result.then(
			(newUser) => {
				console.log('New user added:', newUser);
				if (newUser) {
					this.userStateService.addUser(newUser);
				}
			},
			() => {
				// dismissed
			}
		);
	}

	openViewRolesModal(userId: string): void {
		const modalRef = this.modalService.open(UserRolesModal, { centered: true, size: 'lg' });
		
		modalRef.componentInstance.userId = userId;
		
		modalRef.result.then(
			() => {
				// closed
			},
			() => {
				// dismissed
			}
		);
	}

	openActivateOrDeactivateUserDialog(user: User): void {
		const action = user.isActive ? 'Deactivate' : 'Activate';
		const modalRef = this.modalService.open(ConfirmationModal, { centered: true });

		modalRef.componentInstance.title = `${action} User`;
		modalRef.componentInstance.description = `Are you sure you want to ${action.toLowerCase()} ${user.firstName} ${user.lastName}?`;
		modalRef.componentInstance.confirmButtonText = action;
		modalRef.componentInstance.confirmButtonClass = user.isActive ? 'btn-danger' : 'btn-success';

		modalRef.result.then((result => {
			if (result === 'confirm') {
				this.activateOrDeactivateUser(user.id, !user.isActive);
			}

		})).catch(() => {});
	}

	activateOrDeactivateUser(userId: string, status: boolean): void {
		this.userService.updateStatus(userId, status).subscribe({
			next: (response: ApiResponse<string>) => {
				if (response && response.isSuccessful) {
					this.toastService.show(`User ${status ? 'activated' : 'deactivated'} successfully`);
					this.userStateService.updateUser({ id: userId, isActive: status } as User);
				} else {
					this.toastService.show(`Failed to ${status ? 'activate' : 'deactivate'} user. Please try again later.`, 'error');
				}
			}, error: (error) => {
				this.toastService.show(`Failed to ${status ? 'activate' : 'deactivate'} user. Please try again later.`, 'error');
			}
		});
	}

	onPageChange(newPage: number): void {
		this.currentPage.set(newPage);
	}

	updateUsers(newList: User[]): void {
		this.users.set(newList);
		this.currentPage.set(1); // Reset to first page when the user list changes
	}
}
