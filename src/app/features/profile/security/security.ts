import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/widgets/toast/toast.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { USER_DATA } from '../../../core/data/constants/UserSettingsConstants';
import { UpdatePassword } from '../../../core/data/UpdatePassword';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  imports: [ReactiveFormsModule],
  templateUrl: './security.html',
  styleUrl: './security.scss',
})
export class Security {

	private fb = inject(FormBuilder);
	private userService = inject(UserService);
	private storageService = inject(LocalStorageService);
	private toastService = inject(ToastService);
	private router = inject(Router);

	passwordForm = this.fb.group({
		currentPassword: [''],
		newPassword: [''],
		confirmPassword: ['']
	});
	

	onSubmit(): void {
		if (this.passwordForm.invalid) return;

		const userData = this.storageService.getItem<CurrentUser>(USER_DATA);
		const userId = userData?.id
		const currentPassword = this.passwordForm.get('currentPassword')?.value;
		const newPassword = this.passwordForm.get('newPassword')?.value;
		const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

		const updatePassword: UpdatePassword = {
			userId: userId ?? '',
			currentPassword: currentPassword ?? '',
			newPassword: newPassword ?? '',
			confirmNewPassword: confirmPassword ?? ''
		}

		this.userService.resetPassword(updatePassword).subscribe({
			next: (res) => {
				this.toastService.show('Password changed successfully. Please login again.')

				this.storageService.clear();

				setTimeout(() => {
					this.router.navigate(['/login']); 
				}, 5000);
			},
			error: (err) => {
				this.toastService.show('Failed to update user', err);
			}
		});
	}
}
