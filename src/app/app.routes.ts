import { Routes } from '@angular/router';
import { LoginPage } from './features/auth/login-page/login-page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'login', component: LoginPage },
    { 
        path: 'main',
        canActivate: [authGuard],
        loadComponent: () => import('./core/layout/layout').then(m => m.Layout) 
    }
];
