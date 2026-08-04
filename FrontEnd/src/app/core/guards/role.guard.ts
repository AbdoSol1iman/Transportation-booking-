import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const allowedRoles = (route.data?.['roles'] as string[]) || [];
  const userRole = authService.getUserRole() || 'passenger';

  if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return true;
  }

  alert('عفواً، ليس لديك صلاحية الوصول لهذه الصفحة.');
  router.navigate(['/']);
  return false;
};
