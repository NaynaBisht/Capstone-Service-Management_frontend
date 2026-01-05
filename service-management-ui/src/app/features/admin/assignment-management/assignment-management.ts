import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookingApiResponse } from '../../../shared/model/booking.model';
import { AdminBookingService } from '../../../shared/services/admin-booking.service';
import { TechnicianService } from '../../../shared/services/technician.service';
import { AssignmentService } from '../../../shared/services/assignment.service';

// ---------------- INTERFACE ----------------
interface AssignmentRow {
  bookingId: string;
  serviceName: string;
  subCategory: string;
  scheduledDate: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  technician?: {
    name: string;
    phone: string;
    avatar: string;
  };
  status: 'ASSIGNED' | 'PENDING' | 'COMPLETED' | 'UNASSIGNED';
  actionType: 'Reassign' | 'Assign';
}

interface AvailableTechnician {
  id: string;
  name: string;
  skill: string;
  avatar: string;
  status: 'AVAILABLE' | 'BUSY';
}

@Component({
  selector: 'app-assignment-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignment-management.html',
})
export class AssignmentManagementComponent implements OnInit {
  // ---------------- TABLE DATA ----------------
  assignments: AssignmentRow[] = [];
  isLoading = false;

  // ---------------- MODAL STATE ----------------
  isAssignModalOpen = false;
  isReassignModalOpen = false;
  selectedBooking: AssignmentRow | null = null;

  // ---------------- TECHNICIAN STATE ----------------
  availableTechnicians: AvailableTechnician[] = [];
  selectedTechnicianId: string | null = null;

  constructor(
    private bookingService: AdminBookingService,
    private technicianService: TechnicianService,
    private assignmentService: AssignmentService,
    private cdr: ChangeDetectorRef
  ) {}

  // ---------------- LIFECYCLE ----------------
  ngOnInit(): void {
    this.loadBookings();
  }

  // ---------------- LOAD BOOKINGS ----------------
  loadBookings(): void {
    this.isLoading = true;

    this.bookingService.getAllBookings().subscribe({
      next: (bookings: BookingApiResponse[]) => {
        this.assignments = bookings.map((b) => this.mapBookingToAssignmentRow(b));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.isLoading = false;
      },
    });
  }

  // ---------------- MAP BACKEND → UI ----------------
  private mapBookingToAssignmentRow(booking: BookingApiResponse): AssignmentRow {
    return {
      bookingId: booking.bookingId,
      serviceName: booking.serviceName,
      subCategory: booking.categoryName,
      scheduledDate: booking.scheduledDate,
      timeSlot: booking.timeSlot,
      customerName: '',
      customerPhone: '',
      technician: undefined,
      status: booking.status === 'CONFIRMED' ? 'UNASSIGNED' : 'COMPLETED',
      actionType: booking.status === 'CONFIRMED' ? 'Assign' : 'Reassign',
    };
  }

  // ---------------- UI HELPERS ----------------
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  formatTime(slot: string): string {
    const map: Record<string, string> = {
      SLOT_9_11: '9:00 AM - 11:00 AM',
      SLOT_11_1: '11:00 AM - 1:00 PM',
    };
    return map[slot] || slot;
  }

  // ---------------- ACTION HANDLERS ----------------
  handleAction(item: AssignmentRow): void {
    this.selectedBooking = item;
    this.selectedTechnicianId = null;

    if (item.actionType === 'Assign') {
      this.isAssignModalOpen = true;
    } else {
      this.isReassignModalOpen = true;
    }

    this.fetchAvailableTechnicians(item.subCategory);
  }

  closeModals(): void {
    this.isAssignModalOpen = false;
    this.isReassignModalOpen = false;
    this.selectedBooking = null;
    this.selectedTechnicianId = null;
    this.availableTechnicians = [];
  }

  // ---------------- TECHNICIAN FLOW ----------------
  fetchAvailableTechnicians(skill: string): void {
    this.technicianService.getAllAvailableTechnicians().subscribe({
      next: (techs) => {
        this.availableTechnicians = techs.map((t) => ({
          id: t.technicianId,
          name: t.name,
          skill: t.skills.join(', '),
          avatar: 'https://i.pravatar.cc/150?u=' + t.technicianId,
          status: 'AVAILABLE',
        }));

        this.cdr.detectChanges();
      },
      error: () => {
        this.availableTechnicians = [];
      },
    });
  }

  selectTechnician(id: string): void {
    this.selectedTechnicianId = id;
  }

  // ---------------- ASSIGNMENT API ----------------
  confirmAssignment(): void {
    if (!this.selectedBooking || !this.selectedTechnicianId) return;

    const booking = this.selectedBooking;

    this.assignmentService
      .createAssignment({
        bookingId: booking.bookingId,
        serviceId: booking.subCategory.toUpperCase(),
        scheduledDate: booking.scheduledDate,
        timeSlot: booking.timeSlot,
      })
      .subscribe({
        next: () => {
          this.closeModals();
          this.loadBookings();
        },
        error: (err) => {
          console.error('Assignment failed', err);
          alert('Failed to create assignment');
        },
      });
  }
}
