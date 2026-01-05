import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { AuthModalService } from '../../shared/services/auth-modal.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ClickOutsideDirective
  ],
  templateUrl: './navbar.html',
})
export class NavbarComponent {

  private authModal = inject(AuthModalService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isDropdownOpen = false;

  // Helper to get the current role (CUSTOMER, TECHNICIAN, etc.)
  get userRole(): string | null {
    return this.authService.getRole();
  }

  // Check if logged in
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  openLogin(): void {
    this.closeDropdown();
    this.authModal.open('login');
  }

  openRegister(): void {
    this.closeDropdown();
    this.authModal.open('register');
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}