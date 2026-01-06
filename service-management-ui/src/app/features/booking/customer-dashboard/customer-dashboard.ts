import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../../../shared/services/booking.service';

interface Booking {
  id: string;
  serviceName: string;
  category: string;
  scheduledDate: string;
  timeSlot: string;
  address: string;
  // Added RESCHEDULED to the status type
  status: 'PENDING' | 'CONFIRMED' | 'ASSIGNED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  technicianName?: string;
  technicianPhone?: string;
}

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.css'],
})
export class CustomerDashboardComponent implements OnInit {
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private cdr = inject(ChangeDetectorRef);

  bookings: Booking[] = [];
  selectedStatus: string = 'ALL';

  // -- Modal State Variables --
  showCancelModal = false;
  showRescheduleModal = false;
  selectedBookingId: string | null = null;

  // -- Date & Time Picker Variables --
  rescheduleDate: string = '';
  rescheduleTimeSlot: string = '';
  minDate: string = '';
  maxDate: string = '';

  // -- Success Message --
  successMessage: string = '';

  availableTimeSlots = [
    { key: 'SLOT_9_11', label: '9:00 AM - 11:00 AM' },
    { key: 'SLOT_11_13', label: '11:00 AM - 1:00 PM' },
    { key: 'SLOT_14_16', label: '2:00 PM - 4:00 PM' },
    { key: 'SLOT_16_18', label: '4:00 PM - 6:00 PM' },
  ];

  ngOnInit() {
    this.loadBookings();
    this.calculateDateLimits();
  }

  loadBookings() {
    this.bookingService.getMyBookings().subscribe({
      next: (data: any[]) => {
        this.bookings = data.map((backendBooking) =>
          this.mapBackendDataToFrontend(backendBooking)
        );
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => {
        console.error('Failed to fetch bookings:', err);
      },
    });
  }

  mapBackendDataToFrontend(data: any): Booking {
    const timeSlotObj = this.availableTimeSlots.find(
      (slot) => slot.key === data.timeSlot
    );
    const readableTime = timeSlotObj ? timeSlotObj.label : data.timeSlot;

    let readableAddress = 'No Address Provided';
    if (data.serviceAddress) {
      readableAddress = `${data.serviceAddress.addressLine1}, ${data.serviceAddress.city}`;
    }

    return {
      id: data.bookingId,
      serviceName: data.serviceName,
      category: data.categoryName,
      scheduledDate: data.scheduledDate,
      timeSlot: readableTime,
      address: readableAddress,
      status: data.status,
      technicianName: data.technicianName || undefined,
      technicianPhone: data.technicianPhone || undefined,
    };
  }

  calculateDateLimits() {
    const today = new Date();
    const max = new Date();
    max.setDate(today.getDate() + 3);

    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = max.toISOString().split('T')[0];
  }

  filteredBookings() {
    if (this.selectedStatus === 'ALL') return this.bookings;
    return this.bookings.filter((b) => b.status === this.selectedStatus);
  }

  // Helper: Should the buttons be visible at all? (Hide for COMPLETED)
  shouldShowActions(status: string): boolean {
    return status !== 'COMPLETED';
  }

  // Helper: Logic for disabling Reschedule button
  isRescheduleDisabled(status: string): boolean {
    // Disabled if already Cancelled OR Rescheduled
    return status === 'CANCELLED' || status === 'RESCHEDULED';
  }

  // Helper: Logic for disabling Cancel button
  isCancelDisabled(status: string): boolean {
    // Disabled if already Cancelled
    return status === 'CANCELLED';
  }

  openCancelModal(id: string) {
    this.selectedBookingId = id;
    this.showCancelModal = true;
  }

  openRescheduleModal(id: string) {
    this.selectedBookingId = id;
    this.rescheduleDate = '';
    this.rescheduleTimeSlot = '';
    this.showRescheduleModal = true;
  }

  closeModals() {
    this.showCancelModal = false;
    this.showRescheduleModal = false;
    this.selectedBookingId = null;
  }

  confirmCancel() {
    if (this.selectedBookingId) {
      this.bookingService.cancelBooking(this.selectedBookingId).subscribe({
        next: () => {
          this.successMessage = 'Your booking has been successfully cancelled.';
          this.closeModals();
          this.loadBookings();
          this.cdr.detectChanges(); // Force UI update
        },
        error: (err) => {
          console.error('Cancel failed:', err);
          this.closeModals();
          this.cdr.detectChanges();
        },
      });
    }
  }

  confirmReschedule() {
    if (this.selectedBookingId && this.rescheduleDate && this.rescheduleTimeSlot) {
      const payload = {
        scheduledDate: this.rescheduleDate,
        timeSlot: this.rescheduleTimeSlot,
      };

      this.bookingService
        .rescheduleBooking(this.selectedBookingId, payload)
        .subscribe({
          next: () => {
            this.successMessage = 'Your booking has been successfully rescheduled.';
            this.closeModals();
            this.loadBookings();
            this.cdr.detectChanges(); // Force UI update
          },
          error: (err) => {
            console.error('Reschedule failed:', err);
            this.closeModals();
            this.cdr.detectChanges();
          },
        });
    }
  }

  viewDetails(id: string) {
    this.router.navigate(['/booking', id]);
  }
}