import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface RegisterRequest {
  email: string;
  password: string;
  role: 'CUSTOMER';
}

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API = 'http://localhost:8765/api/auth';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  // ---------- PLATFORM CHECK ----------
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // ---------- LOGIN ----------
  login(data: { email: string; password: string }) {
    return this.http
      .post<{ token: string; role: string }>(`${this.API}/login`, data)
      .pipe(
        tap(res => {
          if (!this.isBrowser()) return;

          localStorage.setItem('access_token', res.token);
          localStorage.setItem(
            'user',
            JSON.stringify({ role: res.role })
          );
        })
      );
  }

  // ---------- REGISTER ----------
  register(data: RegisterRequest) {
    return this.http.post(`${this.API}/register`, data);
  }

  // ---------- LOGOUT ----------
  logout(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // ---------- AUTH STATE ----------
  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('access_token');
  }

  getUser(): AuthUser | null {
    if (!this.isBrowser()) return null;

    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  // ---------- SESSION RESTORE ----------
  restoreSession() {
    if (!this.isBrowser() || !this.isLoggedIn()) {
      return of(null);
    }

    return this.http.get<AuthUser>(`${this.API}/me`).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(err => {
        console.error('Session restore failed', err);
        // DO NOT AUTO-LOGOUT ON SSR / TRANSIENT FAILURE
        return of(null);
      })
    );
  }
}
