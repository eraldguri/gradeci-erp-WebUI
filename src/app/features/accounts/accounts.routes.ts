import { Routes } from "@angular/router";

export const ACCOUNTS_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'view-accounts',
                pathMatch: 'full'
            },
            {
                path: 'view-accounts',
                loadComponent: () => import('./pages/view-accounts/view-accounts').then(m => m.ViewAccounts)
            },
            {
                path: 'create-account',
                loadComponent: () => import('./pages/create-account/create-account').then(m => m.CreateAccount)
            }
        ]
    }
];