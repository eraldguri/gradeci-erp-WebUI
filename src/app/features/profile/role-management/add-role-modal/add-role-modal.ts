import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../core/widgets/toast/toast.service';
import { RolesService } from '../../../../core/services/roles.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRoleRequest } from '../../../../core/data/roles/AddRoleRequest';
import { RoleResponse } from '../../../../core/data/roles/RoleResponse';

@Component({
  selector: 'app-add-role-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-role-modal.html',
  styleUrl: './add-role-modal.scss',
})
export class AddRoleModal {
  roles = signal<RoleResponse[]>([]);

  activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);
  private roleService = inject(RolesService);
  private toastService = inject(ToastService);

  isSubmitting = signal(false);
  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const raw = this.form.value;

    const payload: AddRoleRequest = {
      name: raw.name ?? '',
      description: raw.description ?? '',
    };

    this.roleService.addRole(payload).subscribe({
      next: (response) => {
        this.toastService.show('Role added successfully.', 'success');
        this.activeModal.close(response.data);
      },
      error: (error) => {
        this.toastService.show('Failed to add role.', 'error');
        console.error('Failed to add role', error);
        this.isSubmitting.set(false);
      }
    });
  }
}
