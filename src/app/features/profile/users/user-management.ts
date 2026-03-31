import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/widgets/toast/toast.service';
import { ApiResponse } from '../../../core/data/ApiResponse';

import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserModal } from './add-user-modal/add-user-modal';

@Component({
  selector: 'app-users',
  imports: [NgbDropdownModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement implements OnInit {
	private userService = inject(UserService);
	private modalService = inject(NgbModal);
	private toastService = inject(ToastService);

	users = signal<User[]>([]);
	isLoading = signal(false);

	ngOnInit(): void {
		this.getUsers();
	}

	getUsers(): void {
		this.isLoading.set(true);

		this.userService.getAllUsers().subscribe({
			next: (response: ApiResponse<User[]>) => {
				this.users.set(response?.data ?? []);

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
				(result) => {
					if (result === 'confirm') {
						this.getUsers();
					}
				},
				() => {
					// dismissed
				}
			);
		}
}
