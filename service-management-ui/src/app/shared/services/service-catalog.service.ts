import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceCatalogService {

  private http = inject(HttpClient);

  private readonly BASE_URL = '/api/services';

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(this.BASE_URL);
  }
}
