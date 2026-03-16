import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage.service';

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

					this.storage.setItem("user_prefs", response.data);
					
					this.isLoading.set(false);
					this.router.navigate(['/main']);
				}
			},
			error: (error) => {
				this.isLoading.set(false);
				this.errorMessage.set(error);
			}
		})
	}

}
