import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  private readonly API = 'http://localhost:8765/api/technicians';

  constructor(private http: HttpClient) {}

  getAllAvailableTechnicians() {
    return this.http.get<AllTechnicianResponse[]>(
      `${this.API}/available`
    );
  }
}
