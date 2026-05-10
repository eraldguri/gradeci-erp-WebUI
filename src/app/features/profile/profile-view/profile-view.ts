import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { USER_DATA } from '../../../core/data/constants/UserSettingsConstants';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/widgets/toast/toast.service';
import { CountryService } from '../../../core/services/country.service';
import { PhoneNumberSelector } from "../../../core/widgets/phone-number-selector/phone-number-selector";

@Component({
  selector: 'app-profile-view',
  imports: [ReactiveFormsModule, PhoneNumberSelector],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.scss',
})
export class ProfileView implements OnInit {
	
	private fb = inject(FormBuilder);
	private storageService = inject(LocalStorageService);
	private userService = inject(UserService);
	private toastService = inject(ToastService);
	private countryService = inject(CountryService);

	userData = signal<CurrentUser | null>(null);
	
    userForm = this.fb.group({
		firstName: [''],
		lastName: [''],
		email: [''],
		phoneNumber: [''],
		countryCode: ['']
	});

	countries = this.countryService.countries;
	isLoading = computed(() => this.countries.length === 0);

	ngOnInit(): void {
		const user = this.storageService.getItem<CurrentUser>(USER_DATA);

		if (user) { 
			this.userData.set(user);

			this.userForm.patchValue({
				firstName: user.name,
				lastName: user.surname,
				email: user.email,
				phoneNumber: user.mobile
			});
		}

	}

	onSubmit() {
		if (this.userForm.invalid) return;

		const firstName = this.userForm.get('firstName')?.value;
		const lastName = this.userForm.get('lastName')?.value;
		const phoneNumber = this.userForm.get('phoneNumber')?.value;

		const updateUser: UpdateUser = {
			id: this.userData()?.id ?? '',
			firstName: firstName ?? '',
			lastName: lastName ?? '',
			phoneNumber: phoneNumber ?? ''
		}

		this.userService.updateUser(updateUser)
    		.subscribe({
				next: (res) => {
					this.toastService.show('User updated successfully!', 'success');
				},
				error: (err) => {
					this.toastService.show('Failed to update user', 'error');
				}
		});
	}
	
}
