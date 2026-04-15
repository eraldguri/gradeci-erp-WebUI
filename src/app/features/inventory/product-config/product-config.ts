import { Component, signal } from '@angular/core';
import { ProductConfigOperationTypesTab } from "./tabs/product-config-operation-types-tab/product-config-operation-types-tab";
import { ProductConfigWarehousesTab } from "./tabs/product-config-warehouses-tab/product-config-warehouses-tab";
import { ProductConfigCategoriesTab } from "./tabs/product-config-categories-tab/product-config-categories-tab";
import { ProductConfigAttributesTab } from "./tabs/product-config-attributes-tab/product-config-attributes-tab";
import { ProductConfigDeliveryMethodsTab } from "./tabs/product-config-delivery-methods-tab/product-config-delivery-methods-tab";

interface ProductConfigTabItem {
	id: string;
	label: string;
}

@Component({
  selector: 'app-product-config',
  imports: [ProductConfigOperationTypesTab, ProductConfigWarehousesTab, ProductConfigCategoriesTab, ProductConfigAttributesTab, ProductConfigDeliveryMethodsTab],
  templateUrl: './product-config.html',
  styleUrl: './product-config.scss',
})
export class ProductConfig {
	tabs = signal<ProductConfigTabItem[]>([
		{ id: 'warehouses', label: 'Warehouses' },
		{ id: 'operation-types', label: 'Operation Types' },
		{ id: 'categories', label: 'Categories' },
		{ id: 'attributes', label: 'Attributes' },
		{ id: 'delivery-methods', label: 'Delivery Methods' }
	]);
	activeTab = signal<string>('warehouses');

	setActiveTab(tab: ProductConfigTabItem): void {
		this.activeTab.set(tab.id);
	}
}
