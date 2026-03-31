import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../core/services/user.service';
import { ApiResponse } from '../../../../core/data/ApiResponse';

@Component({
  selector: 'app-user-roles-modal',
  imports: [],
  templateUrl: './user-roles-modal.html',
  styleUrl: './user-roles-modal.scss',
})
export class UserRolesModal {
	activeModal = inject(NgbActiveModal);
	private userService = inject(UserService);
	@Input() userId: string = '';

	userRoles = signal<UserRolesResponse[]>([]);

	ngOnInit() {
		if (this.userId) {
			this.getUserRoles(this.userId);
		}
	}

	getUserRoles(userId: string): void {
		this.userService.getUserRoles(userId).subscribe({
			next: (response: ApiResponse<UserRolesResponse[]>) => {
				if (response?.data) {
					console.log(response.data);
					this.userRoles.set(response.data);
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

}
