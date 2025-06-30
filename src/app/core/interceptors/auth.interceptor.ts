// auth.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('[AuthInterceptor] Error caught:', error);

      if (error.status === 401 || error.status === 403) {
        auth.logout(); // clear token
        router.navigate(['/login'], { queryParams: { sessionExpired: true } })
          .then(success => console.log('Navigation to login:', success))
          .catch(err => console.error('Navigation error:', err));
      }

      return throwError(() => error);
    })
  );
};
