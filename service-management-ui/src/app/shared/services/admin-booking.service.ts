import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingApiResponse } from '../model/booking.model';

@Injectable({ providedIn: 'root' })
export class AdminBookingService {

  private baseUrl = 'http://localhost:8765/api/bookings';

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<BookingApiResponse[]> {
    return this.http.get<BookingApiResponse[]>(this.baseUrl);
  }
}
