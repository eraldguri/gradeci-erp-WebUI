import { Routes } from '@angular/router';
import { LoginPage } from './features/auth/login-page/login-page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
    },
    { 
        path: 'login', 
        component: LoginPage 
    },
    { 
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./core/layout/layout').then(m => m.Layout),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard-view/dashboard-view').then(m => m.DashboardView)
            },
            { 
                path: 'accounts',
                loadChildren: () => import('./features/accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES)
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile-view/profile-view').then(m => m.ProfileView)
            },
            {
                path: 'security',
                loadComponent: () => import('./features/profile/security/security').then(m => m.Security)
            },
            {
                path: 'tenants',
                loadComponent: () => import('./features/profile/tenant-management/tenant-management').then(m => m.TenantManagement)
            }
        ]
    }
];
