import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { AUTH_TOKEN, USER_DATA, USER_PREFS } from '../data/constants/UserSettingsConstants';
import { LOGIN } from '../data/constants/ApiConstants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const storageService = inject(LocalStorageService);

	if (req.url.includes(LOGIN)) {
		return next(req);
	}

	const token = storageService.getItem<string>(AUTH_TOKEN);

	if (token) {
		const cloned = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
		return next(cloned);
	}

	return next(req);
};