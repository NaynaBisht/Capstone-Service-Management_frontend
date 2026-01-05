import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '../services/auth-modal.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private authModal: AuthModalService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (!this.authService.isLoggedIn()) {
      // Not logged in → open login modal
      this.authModal.open('login');
      return false;
    }

    const allowedRoles = route.data['roles'] as string[] | undefined;

    if (!allowedRoles) {
      // Authenticated, no role restriction
      return true;
    }

    const userRole = this.authService.getRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Role not allowed
    this.router.navigate(['/']);
    return false;
  }
}
