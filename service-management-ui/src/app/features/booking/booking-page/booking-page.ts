import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router for navigation
import { ServiceCatalogService } from '../../../shared/services/service-catalog.service';
import { BookingService } from '../../../shared/services/booking.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-page.html',
})
export class BookingPageComponent implements OnInit {
  bookingForm!: FormGroup;

  loading = false;
  error = '';

  services: any[] = [];
  categories: any[] = [];
  selectedService: any | null = null;

  // Date Logic
  minDate = new Date().toISOString().split('T')[0];
  maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  })();

  constructor(
    private fb: FormBuilder, 
    private serviceCatalogService: ServiceCatalogService, 
    private bookingService: BookingService, // Inject BookingService
    private cdr: ChangeDetectorRef,
    private router: Router // Inject Router
  ) {
    this.bookingForm = this.fb.group({
      serviceId: ['', Validators.required],
      categoryId: ['', Validators.required],

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
      next: (data: any[]) => {
        this.services = data.filter((s) => s.active);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load services';
        this.loading = false;
        console.error(err);
      },
    });
  }

  selectService(service: any): void {
    this.selectedService = service;
    this.categories = service.categories || [];

    // Reset category when service changes
    this.bookingForm.patchValue({
      serviceId: service._id || service.id,
      categoryId: '',
    });
  }

  submit(): void {
    this.error = '';

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.bookingForm.getRawValue();

    // 1. Find the Category Name (API needs it)
    const selectedCategory = this.categories.find(c => c.categoryId === formValue.categoryId);

    // 2. Construct the Payload matching Postman structure
    const payload = {
      serviceId: formValue.serviceId,
      serviceName: this.selectedService?.name || '', // Add Service Name
      categoryId: formValue.categoryId,
      categoryName: selectedCategory?.name || '',    // Add Category Name
      
      scheduledDate: formValue.scheduledDate,
      timeSlot: formValue.timeSlot,
      
      // Nest the address fields
      address: {
        addressLine1: formValue.addressLine1,
        city: formValue.city,
        state: formValue.state,
        zipCode: formValue.zipCode
      },

      issueDescription: formValue.issueDescription,
      paymentMode: formValue.paymentMode
    };

    console.log('SENDING PAYLOAD:', payload);

    // 3. Call the API
    this.bookingService.createBooking(payload).subscribe({
      next: (res) => {
        console.log('Booking Success:', res);
        this.loading = false;
        
        // Redirect to My Bookings
        this.router.navigate(['/customer/bookings']); 
      },
      error: (err) => {
        console.error('Booking Failed:', err);
        this.loading = false;
        this.error = 'Booking failed. Please try again.';
      }
    });
  }
}