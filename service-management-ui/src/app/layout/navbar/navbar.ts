import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { AuthModalService } from '../../shared/services/auth-modal.service';

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

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  openLogin() {
    this.closeDropdown();
    this.authModal.open('login');
  }

  openRegister() {
    this.closeDropdown();
    this.authModal.open('register');
  }
}
