import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '../models/auth.models';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authUser = authService.authUser() as LoginResponse | null;
  
  // Si l'utilisateur est authentifié et a un token
  if (authUser && authUser.token) {
    // Clone la requête et ajoute l'en-tête Authorization
    const authReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${authUser.token}`
      ),
    });
    return next(authReq);
  }
  
  // Sinon, passe la requête originale sans modification
  return next(req);
};
