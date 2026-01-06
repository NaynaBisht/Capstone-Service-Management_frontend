import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AssignmentService {

  private readonly API = 'http://localhost:8765/api/assignments';

  constructor(private http: HttpClient) {}

  createAssignment(payload: {
    bookingId: string;
    serviceId: string;
    technicianId: string; // <--- ADD THIS
    scheduledDate: string;
    timeSlot: string;
  }) {
    return this.http.post(this.API, payload);
  }
}