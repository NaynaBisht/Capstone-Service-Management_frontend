import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TechnicianService } from '../../../shared/services/technician.service';

interface Assignment {
  assignmentId: string;
  bookingId: string;
  createdAt: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './technician-dashboard.html',
  styleUrls: ['./technician-dashboard.css'],
  // Enable OnPush to stop automatic, frequent re-rendering
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicianDashboardComponent implements OnInit {

  activeTab: 'NEW' | 'ONGOING' | 'COMPLETED' = 'NEW';
  assignments: Assignment[] = [];

  // Inject ChangeDetectorRef
  constructor(
    private technicianService: TechnicianService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.fetchMyAssignments();
  }

  setActiveTab(tab: 'NEW' | 'ONGOING' | 'COMPLETED') {
    this.activeTab = tab;
  }

  // --- Filters ---
  // With OnPush, these heavy getters will run significantly fewer times
  get newAssignments() {
    return this.assignments.filter(a => a.status === 'PENDING');
  }

  get ongoingAssignments() {
    return this.assignments.filter(
      a => a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS'
    );
  }

  get completedAssignments() {
    return this.assignments.filter(
      a => a.status === 'COMPLETED' || a.status === 'CANCELLED'
    );
  }

  getCurrentList() {
    if (this.activeTab === 'NEW') return this.newAssignments;
    if (this.activeTab === 'ONGOING') return this.ongoingAssignments;
    return this.completedAssignments;
  }

  // --- API Integration ---
  fetchMyAssignments() {
    this.technicianService.getMyAssignments().subscribe({
      next: (data: any[]) => {
        this.assignments = data.map(item => ({
          assignmentId: item.assignmentId,
          bookingId: item.bookingId,
          createdAt: item.createdAt,
          status: item.status
        }));
        // Manually mark for check because this happens asynchronously
        this.cdr.markForCheck(); 
      },
      error: (err) => console.error('Error fetching assignments:', err),
    });
  }

  // --- Actions ---
  acceptAssignment(assignmentId: string) {
    this.technicianService.acceptAssignment(assignmentId).subscribe({
      next: () => {
        const item = this.assignments.find(a => a.assignmentId === assignmentId);
        if (item) item.status = 'ASSIGNED';
        this.setActiveTab('ONGOING');
        
        // Update view after async mutation
        this.cdr.markForCheck();
      },
      error: err => console.error('Accept failed:', err)
    });
  }

  rejectAssignment(assignmentId: string) {
    if (!confirm('Are you sure you want to decline this assignment?')) return;

    this.technicianService.rejectAssignment(assignmentId).subscribe({
      next: () => {
        this.assignments = this.assignments.filter(a => a.assignmentId !== assignmentId);
        
        // Update view after async list modification
        this.cdr.markForCheck();
      },
      error: err => console.error('Reject failed:', err)
    });
  }

  startAssignment(assignmentId: string) {
    this.technicianService.startAssignment(assignmentId).subscribe({
      next: () => {
        const item = this.assignments.find(a => a.assignmentId === assignmentId);
        if (item) item.status = 'IN_PROGRESS';
        this.setActiveTab('ONGOING');
        
        // Update view
        this.cdr.markForCheck();
      },
      error: err => console.error('Start failed:', err)
    });
  }

  markComplete(assignmentId: string) {
    this.technicianService.completeAssignment(assignmentId).subscribe({
      next: () => {
        const item = this.assignments.find(a => a.assignmentId === assignmentId);
        if (item) item.status = 'COMPLETED';
        this.setActiveTab('COMPLETED');
        
        // Update view
        this.cdr.markForCheck();
      },
      error: err => console.error('Complete failed:', err)
    });
  }
}