import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const expectedRoles = route.data?.['roles'] as string[];
  const userRole = localStorage.getItem('role');

  if (!userRole || !expectedRoles.includes(userRole)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
