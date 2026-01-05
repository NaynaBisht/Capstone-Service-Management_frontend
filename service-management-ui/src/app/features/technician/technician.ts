import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-technician',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './technician.html',
  styleUrls: ['./technician.css']
})
export class TechnicianComponent {

  step = 1;

  private fb = inject(FormBuilder);

  technicianForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    // Added pattern validator for exactly 10 digits
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    city: ['', Validators.required],
    skills: ['', Validators.required],
    experienceYears: [null as number | null, [Validators.required, Validators.min(0)]]
  });

  // Helper to get form controls for easier access in template
  get f() {
    return this.technicianForm.controls;
  }

  /* ---------- Stepper ---------- */
  nextStep() {
    if (this.technicianForm.invalid) {
      // This triggers the validation messages to show up
      this.technicianForm.markAllAsTouched();
      return;
    }
    this.step = 2;
  }

  backStep() {
    this.step = 1;
  }
}