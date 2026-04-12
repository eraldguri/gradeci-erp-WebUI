import { Component, signal } from '@angular/core';
import { AddProductGeneralInformationTab } from "./tabs/add-product-general-information-tab/add-product-general-information-tab";
import { AddProductAttributesAndVariantsTab } from "./tabs/add-product-attributes-and-variants-tab/add-product-attributes-and-variants-tab";
import { AddProductPricesTab } from "./tabs/add-product-prices-tab/add-product-prices-tab";
import { AddProductPurchaseTab } from "./tabs/add-product-purchase-tab/add-product-purchase-tab";

@Component({
  selector: 'app-add-product',
  imports: [AddProductGeneralInformationTab, AddProductAttributesAndVariantsTab, AddProductPricesTab, AddProductPurchaseTab],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct {

	tabs = signal([
		{ id: 'general', label: 'General Information' },
		{ id: 'variants', label: 'Attributes & Variants' },
		{ id: 'prices', label: 'Prices' },
		{ id: 'purchase', label: 'Purchase' }
	]);
	activeTabId = signal('general');

	productTypes = signal([
		{ id: 'goods', label: 'Goods' },
		{ id: 'services', label: 'Services' },
		{ id: 'combo', label: 'Combo' }
	]);

	selectedProductType = signal('goods');

	setProductType(type: string) {
		this.selectedProductType.set(type);
	}

	setActiveTab(tab: string) {
   		this.activeTabId.set(tab);
  	}

	onBackClick(): void {
		window.history.back();
	}
}
