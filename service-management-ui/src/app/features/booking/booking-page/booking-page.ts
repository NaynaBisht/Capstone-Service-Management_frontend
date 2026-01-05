import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceCatalogService } from '../../../shared/services/service-catalog.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-page.html',
})
export class BookingPageComponent implements OnInit {
  
  // Explicit Property Declaration
  bookingForm!: FormGroup;
  loading = false;
  error = '';
  services: any[] = [];

  // Date Logic
  minDate = new Date().toISOString().split('T')[0];
  maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  })();

  constructor(
    private fb: FormBuilder,
    private serviceCatalogService: ServiceCatalogService
  ) {
    // Form Initialization inside Constructor
    this.bookingForm = this.fb.group({
      serviceName: ['', Validators.required],
      categoryName: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      issueDescription: ['', Validators.required],
      paymentMode: ['CASH', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.serviceCatalogService.getServices().subscribe({
      next: (data: any) => {
        this.services = data;
        this.loading = false;
        console.log('SERVICES FROM BACKEND', this.services);
      },
      error: (err: any) => {
        this.error = 'Failed to load services';
        this.loading = false;
        console.error('FAILED TO LOAD SERVICES', err);
      },
    });
  }

  selectService(service: string): void {
    this.bookingForm.patchValue({ serviceName: service });
  }

  submit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const payload = this.bookingForm.getRawValue();
    console.log('BOOKING PAYLOAD', payload);
    // Add API call here
  }
}