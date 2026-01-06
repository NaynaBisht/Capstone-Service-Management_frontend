import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AllTechnicianResponse {
  technicianId: string;
  userId: string;
  name: string;
  skills: string[];
  city: string;
  experienceYears: number;
}

@Injectable({ providedIn: 'root' })
export class TechnicianService {

  private readonly TECHNICIAN_API = 'http://localhost:8765/api/technicians';
  private readonly ASSIGNMENT_API = 'http://localhost:8765/api/assignments';

  constructor(private http: HttpClient) {}

  // --- Technician ---
  getAllAvailableTechnicians() {
    return this.http.get<AllTechnicianResponse[]>(`${this.TECHNICIAN_API}/available`);
  }

  getTechnicianByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.TECHNICIAN_API}/by-user/${userId}`);
  }

  updateAvailability(technicianId: string, status: 'AVAILABLE' | 'UNAVAILABLE') {
    return this.http.patch(`${this.TECHNICIAN_API}/${technicianId}/availability`, { availability: status });
  }

  // --- Assignments ---
  getMyAssignments() {
    return this.http.get<any[]>(`${this.ASSIGNMENT_API}/my`);
  }

  acceptAssignment(id: string) {
    return this.http.put(`${this.ASSIGNMENT_API}/${id}/accept`, {});
  }

  rejectAssignment(id: string) {
    return this.http.put(`${this.ASSIGNMENT_API}/${id}/reject`, {});
  }

  startAssignment(id: string) {
    return this.http.put(`${this.ASSIGNMENT_API}/${id}/start`, {});
  }

  completeAssignment(id: string) {
    return this.http.put(`${this.ASSIGNMENT_API}/${id}/complete`, {});
  }
}
