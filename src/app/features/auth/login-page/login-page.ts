import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AUTH_TOKEN, USER_DATA } from '../../../core/data/constants/UserSettingsConstants';
import { EMAIL_ADDRESS, JwtPayload, MOBILE_PHONE, NAME, NAME_IDENTIFIER, ROLE, SURNAME } from '../../../core/data/JwtPayload';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
	private fb = inject(FormBuilder);
	private authService = inject(AuthService);
	private router = inject(Router);
	private storage = inject(LocalStorageService);

	isLoading = signal(false);
	errorMessage = signal<string | null>(null);

	loginForm = this.fb.group({
		tenant: ['', Validators.required],
		username: ['', Validators.required],
		password: ['', Validators.required]
	});
	user = signal<CurrentUser | null>(null);

	onSubmit() {
		if (this.loginForm.invalid) return;

		this.isLoading.set(true);
		this.errorMessage.set(null);

		const formValue = this.loginForm.getRawValue() as {
			tenant: string;
			username: string;
			password: string;
		};
		
		const requestData: LoginRequest = { 
			username: formValue.username, 
			password: formValue.password 
		};

		this.authService.login(formValue.tenant, requestData).subscribe({
			next: (response) => {
				if (response.isSuccessful) {

					const token = this.authService.decodeToken<JwtPayload>(response.data.jwt);
					this.user.set({
						id: token?.[NAME_IDENTIFIER] || '',
						name: token?.[NAME] || '',
						surname: token?.[SURNAME] || '',
						email: token?.[EMAIL_ADDRESS] || '',
						mobile: token?.[MOBILE_PHONE] || '',
						role: token?.[ROLE] || '',
						tenant: token?.tenant || '',
						permissions: token?.permission || []
					});

					this.storage.setItem(AUTH_TOKEN, response.data.jwt);
					this.storage.setItem("refreshToken", response.data.refreshToken);
					this.storage.setItem("refreshTokenExpiryDate", response.data.refreshTokenExpiryDate);
					this.storage.setItem(USER_DATA, this.user());

					setTimeout(() => {
						this.isLoading.set(false);
						this.router.navigate(['/dashboard']);
					}, 3000);
				}
			},
			error: (error) => {
				this.isLoading.set(false);
				this.errorMessage.set(error);
			}
		})
	}

}
