import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/widgets/toast/toast.service';
import { ApiResponse } from '../../../core/data/ApiResponse';

import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserModal } from './add-user-modal/add-user-modal';
import { UserStateService } from './services/user-state.service';
import { UserRolesModal } from './user-roles-modal/user-roles-modal';
import { TablePagination } from "../../../core/widgets/table-pagination/table-pagination";

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

	onPageChange(newPage: number): void {
		this.currentPage.set(newPage);
	}

	updateUsers(newList: User[]): void {
		this.users.set(newList);
		this.currentPage.set(1); // Reset to first page when the user list changes
	}
}
