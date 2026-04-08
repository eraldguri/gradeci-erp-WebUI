import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesService } from '../../../../core/services/roles.service';
import { RoleResponse } from '../../../../core/data/roles/RoleResponse';
import { ApiResponse } from '../../../../core/data/ApiResponse';
import { ToastService } from '../../../../core/widgets/toast/toast.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { USER_DATA } from '../../../../core/data/constants/UserSettingsConstants';

interface TabItem {
	id: string;
	label: string;
	badge: string;
	group: string;
	permissions?: PermissionItem[];
}

interface PermissionItem {
	name: string;
	description: string;
	assigned: boolean;
}

@Component({
  selector: 'app-permission-management-modal',
  imports: [],
  templateUrl: './permission-management-modal.html',
  styleUrl: './permission-management-modal.scss',
})
export class PermissionManagementModal {
	activeModal = inject(NgbActiveModal);
	private roleService = inject(RolesService);
	private toastService = inject(ToastService);
	private storageService = inject(LocalStorageService);

	@Input() roleId: string = "";
	role = signal<RoleResponse | null>(null);
	isLoading = signal(false);

	tabs = signal<TabItem[]>([]);

	activeTabId = signal<string>('USERS');

	ngOnInit() {
		const userData = this.storageService.getItem<CurrentUser>(USER_DATA);
		this.getFullRoleDetails(userData);
	}

	getFullRoleDetails(userData: CurrentUser | null): void {
		this.isLoading.set(true);
		
		if (this.roleId) {
			this.roleService.getFullRoleDetails(this.roleId).subscribe({
				next: (response: ApiResponse<RoleResponse>) => {
					this.isLoading.set(false);
					
					if (response?.data) {
						this.role.set(response.data);

						this.setPermissionsForTab(response.data.permissions, userData);
					}

					if (response && response.isSuccessful === false) {
						this.toastService.show('Failed to load role details.', 'error');
					}
				},
				error: (error) => {
					this.toastService.show('An error occurred while fetching role details.', 'error');
					this.isLoading.set(false);
				},
				complete: () => {
					this.isLoading.set(false);
				}
			});
		}
	}

	private setPermissionsForTab(permissionsFromServer: string[], userData: CurrentUser | null): void {
		const userPermissionsSet = new Set(userData?.permissions || []);
		
		this.tabs.set([
			{ 
				id: 'USERS', 
				label: 'Users', 
				badge: this.getBadgeCount(permissionsFromServer, userPermissionsSet, 'Users'),
				group: 'Users', 
				permissions: this.getPermissionsForTab(userPermissionsSet, 'Users') 
			},
			{ 
				id: 'USER ROLES', 
				label: 'User Roles', 
				badge: this.getBadgeCount(permissionsFromServer, userPermissionsSet, 'UserRoles'),
				group: 'User Roles', 
				permissions: this.getPermissionsForTab(userPermissionsSet, 'UserRoles') 
			},
			{ 
				id: 'ROLES', 
				label: 'Roles', 
				badge: this.getBadgeCount(permissionsFromServer, userPermissionsSet, 'Roles'),
				group: 'Roles', 
				permissions: this.getPermissionsForTab(userPermissionsSet, 'Roles') 
			},
			{ 
				id: 'ROLE CLAIMS', 
				label: 'Role Claims', 
				badge: this.getBadgeCount(permissionsFromServer, userPermissionsSet, 'RoleClaims'),
				group: 'Role Claims', 
				permissions: this.getPermissionsForTab(userPermissionsSet, 'RoleClaims') 
			},
			{ 
				id: 'COMPANIES', 
				label: 'Companies', 
				badge: this.getBadgeCount(permissionsFromServer, userPermissionsSet, 'Companies'),
				group: 'Companies', 
				permissions: this.getPermissionsForTab(userPermissionsSet, 'Companies') 
			},
			{ 
				id: 'TOKENS', 
				label: 'Tokens', 
				badge: this.getBadgeCount(permissionsFromServer, userPermissionsSet, 'Tokens'),
				group: 'Tokens', 
				permissions: this.getPermissionsForTab(userPermissionsSet, 'Tokens') 
			}
		]);
	}

	private getBadgeCount(permissionsFromServer: string[], userPermissionsSet: Set<string>, tabName: string): string {
		const serverTabPermissions = permissionsFromServer.filter(permission => 
			permission.startsWith(`Permission.${tabName}.`)
		);
		
		const totalCount = serverTabPermissions.length;
		const assignedCount = serverTabPermissions.filter(permission => 
			userPermissionsSet.has(permission)
		).length;
		
		return `${assignedCount}/${totalCount}`;
	}

	private getPermissionsForTab(userPermissionsSet: Set<string>, tabName: string): PermissionItem[] {
		const userTabPermissions = Array.from(userPermissionsSet).filter(permission => 
			permission.startsWith(`Permission.${tabName}.`)
		);
		
		if (userTabPermissions.length === 0) {
			return [];
		}
		
		return userTabPermissions.map(permission => ({
			name: permission,
			description: this.getPermissionDescription(permission, tabName),
			assigned: true // Since these are from userData, they are all assigned
		}));
	}

	private getPermissionDescription(permission: string, tabName: string): string {
		const action = permission.split('.')[2]; // Create, Read, Update, Delete, etc.
		
		const actionMap: Record<string, string> = {
			'Create': `Create new ${tabName.toLowerCase()}`,
			'Read': `View ${tabName.toLowerCase()} information`,
			'Update': `Update existing ${tabName.toLowerCase()}`,
			'Delete': `Delete ${tabName.toLowerCase()}`,
			'RefreshToken': 'Refresh authentication tokens',
			'UpgradeSubscription': 'Upgrade tenant subscription'
		};
		
		return actionMap[action] || `Permission to ${action} ${tabName.toLowerCase()}`;
	}

	getBadgeClass(badge: string): string {
		const [assigned, total] = badge.split('/').map(Number);
		
		if (total === 0 || assigned === 0) return 'bg-danger';
		if (assigned === total) return 'bg-success';
		return 'bg-warning';
	}
}
