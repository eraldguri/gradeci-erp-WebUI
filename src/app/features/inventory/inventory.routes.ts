import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'product-list',
                pathMatch: 'full'
            },
            {
                path: 'product-list',
                loadComponent: () => import('./product-list/product-list').then(m => m.ProductList)
            },
            {
                path: 'add-product',
                loadComponent: () => import('./product-list/add-product/add-product').then(m => m.AddProduct)
            },
            {
                path: 'product-configurations',
                loadComponent: () => import('./product-config/product-config').then(m => m.ProductConfig)
            },
        ]
    }
];