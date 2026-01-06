import { Component, ChangeDetectorRef, inject } from '@angular/core';
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

  // Inject services
  private fb = inject(FormBuilder);
  private authModal = inject(AuthModalService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // ✅ Inject CDR for instant updates

  constructor() {
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

    this.loading = true; // Start loading
    this.error = ''; // Clear previous errors

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        this.loading = false;
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
      error: (err) => {
        this.loading = false;
        // Generic message for security
        this.error = 'Invalid email or password. Please try again.';
        this.cdr.detectChanges(); // Ensure UI updates immediately
      },
    });
  }

  switchToRegister(): void {
    this.authModal.open('register');
  }
}