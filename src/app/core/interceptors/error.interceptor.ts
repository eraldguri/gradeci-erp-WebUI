import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred';

            if (error.error?.Messages && Array.isArray(error.error.Messages) && error.error.Messages.length > 0) {
                errorMessage = error.error.Messages[0];
            } else if (error.message) {
                errorMessage = error.message;
            }

            return throwError(() => errorMessage);
        })
    );

};