import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModalService } from '../../../shared/services/auth-modal.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authModal: AuthModalService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        this.authModal.close();

        switch (res.role) {
          case 'CUSTOMER':
            this.router.navigate(['/customer/bookings']);
            break;
          case 'TECHNICIAN':
            this.router.navigate(['/technician/dashboard']);
            break;
          case 'ADMIN':
          case 'SERVICE_MANAGER':
            this.router.navigate(['/admin/assignments']);
            break;
        }
      },
      error: () => {
        alert('Invalid email or password');
      },
    });
  }

  switchToRegister(): void {
    this.authModal.open('register');
  }
}
