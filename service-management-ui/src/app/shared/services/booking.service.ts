import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  
  private readonly BASE_URL = 'http://localhost:8765/api/bookings';

  createBooking(payload: any): Observable<any> {
    return this.http.post(this.BASE_URL, payload);
  }
}