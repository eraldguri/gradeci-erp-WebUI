import { Component, inject, OnInit, signal } from '@angular/core';
import { CompanyService } from '../../../core/services/company.service';
import { CompanyResponse } from '../../../core/data/company/CompanyResponse';
import { ApiResponse } from '../../../core/data/ApiResponse';
import { ToastService } from '../../../core/widgets/toast/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyStateService } from './services/company-state.service';

@Component({
  selector: 'app-company-management',
  imports: [],
  templateUrl: './company-management.html',
  styleUrl: './company-management.scss',
})
export class CompanyManagement implements OnInit {
	private companyService = inject(CompanyService);
	private companyStateService = inject(CompanyStateService);
	private modalService = inject(NgbModal);
	private toastService = inject(ToastService);

	companies = signal<CompanyResponse[]>([]);
	isLoading = signal(false);
	
	ngOnInit(): void {
		this.getCompanies();

		this.companyStateService.companies$.subscribe(companies => {
			this.companies.set(companies);
		});
	}

	getCompanies(): void {
		this.isLoading.set(true);

		this.companyService.getAllCompanies().subscribe({
			next: (response: ApiResponse<CompanyResponse[]>) => {
				if (response?.data) {
					this.companyStateService.setCompanies(response.data);
				}

				if (response && response.isSuccessful === false) {
					this.toastService.show('Failed to load companies.', 'error');
				}
			},
			error: (error) => {
				console.error('Error getting companies', error);
				this.toastService.show('An error occurred while loading companies.', 'error');
				this.isLoading.set(false);
			},
			complete: () => {
				this.isLoading.set(false);
			}
		});
	}

	openAddCompanyModal(): void {
		// Implement the logic to open a modal for adding a new company
	}
}
