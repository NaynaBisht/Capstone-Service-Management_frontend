import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  // Base URL pointing to your backend
  private readonly BASE_URL = 'http://localhost:8765/api/bookings';

  // Create a new booking
  createBooking(payload: any): Observable<any> {
    return this.http.post(this.BASE_URL, payload);
  }

  // Fetch logged-in user's bookings
  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/my-bookings`);
  }
}
