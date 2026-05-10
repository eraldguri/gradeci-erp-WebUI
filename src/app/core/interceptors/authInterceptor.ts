import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { AUTH_TOKEN } from '../data/constants/UserSettingsConstants';
import { LOGIN, REFRESH_TOKEN } from '../data/constants/ApiConstants';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const storageService = inject(LocalStorageService);
    const authService = inject(AuthService);

    if (req.url.includes(LOGIN) || req.url.includes(REFRESH_TOKEN)) {
        return next(req);
    }

    const token = storageService.getItem<string>(AUTH_TOKEN);

    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return handle401Error(authReq, next, authService);
            }
            return throwError(() => error);
        })
    );
};

const handle401Error = (req: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) => {
  return authService.refreshToken().pipe(
    switchMap((response) => {
      const newToken = response.data.jwt; 
      
      const retryReq = req.clone({
        setHeaders: { Authorization: `Bearer ${newToken}` }
      });
      
      return next(retryReq);
    }),
    catchError((err) => {
      authService.logout();
      return throwError(() => err);
    })
  );
};