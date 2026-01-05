import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthModalService } from '../../../shared/services/auth-modal.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  
  registerForm!: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authModal: AuthModalService,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    const { email, password } = this.registerForm.getRawValue();

    this.authService.register({
      email,
      password,
      role: 'CUSTOMER',
    }).subscribe({
      next: () => {
        this.loading = false;
        alert('Account created. Please login.');
        this.authModal.open('login');
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Registration failed. Please try again.';
      },
    });
  }

  switchToLogin(): void {
    this.authModal.open('login');
  }
}