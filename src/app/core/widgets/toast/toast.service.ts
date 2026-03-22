import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  	type: 'success' | 'error' | 'info';
  	message: string;
}

@Injectable({
  	providedIn: 'root'
})
export class ToastService {
	private _toasts = signal<ToastMessage[]>([]);
	toasts = this._toasts.asReadonly();

	show(message: string, type: ToastMessage['type'] = 'info', duration = 3000) {
		const index = this._toasts().length;
		this._toasts.update(toasts => [...toasts, { message, type }]);

		setTimeout(() => {
			this.remove(index);
		}, duration);
	}

	remove(index: number) {
		this._toasts.update(toasts => toasts.filter((_, i) => i !== index));
	}
}