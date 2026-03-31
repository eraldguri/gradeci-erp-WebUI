import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../core/widgets/toast/toast.service';
import { RegisterUserRequest } from '../../../../core/data/users/RegisterUserRequest';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-add-user-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-user-modal.html',
  styleUrl: './add-user-modal.scss',
})
export class AddUserModal {
	activeModal = inject(NgbActiveModal);
	private fb = inject(FormBuilder);
	private userService = inject(UserService);
	private toastService = inject(ToastService);

	isSubmitting = signal(false);

	form = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		email: ['', [Validators.required, Validators.email]],
		phoneNumber: [''],
		password: ['', Validators.required],
		confirmPassword: ['', Validators.required],
		isActive: [false]
	});

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const raw = this.form.value;

		if (raw.password !== raw.confirmPassword) {
			this.form.get('confirmPassword')?.setErrors({ mismatch: true });
			return;
		}

		const payload: RegisterUserRequest = {
			firstName: raw.firstName ?? '',
			lastName: raw.lastName ?? '',	
			email: raw.email ?? '',
			phoneNumber: raw.phoneNumber ?? '',
			password: raw.password ?? '',
			confirmPassword: raw.confirmPassword ?? '',
			isActive: raw.isActive ?? false
		};


		this.userService.registerUser(payload).subscribe({
			next: (res) => {
				this.toastService.show('User registered successfully.', 'success');

				//TODO: return new user from backend
				const newUser: User = {
					id: res.data ?? '', 
					firstName: payload.firstName,
					lastName: payload.lastName,
					email: payload.email,
					userName: payload.email,
					phoneNumber: payload.phoneNumber,
					isActive: payload.isActive
				};

				this.activeModal.close(newUser);
			},
			error: (error) => {
				this.toastService.show('Failed to register user.', 'error');
				console.error('Error registering user', error);
				this.isSubmitting.set(false);
			},
			complete: () => {
				this.isSubmitting.set(false);
			}
		});
	}
}
