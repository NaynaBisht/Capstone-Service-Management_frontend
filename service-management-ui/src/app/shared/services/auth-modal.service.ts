import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AuthMode = 'login' | 'register';

@Injectable({ providedIn: 'root' })
export class AuthModalService {

  private _isOpen$ = new BehaviorSubject<boolean>(false);
  private _mode$ = new BehaviorSubject<AuthMode>('login');

  isOpen$ = this._isOpen$.asObservable();
  mode$ = this._mode$.asObservable();

  open(mode: AuthMode) {
    this._mode$.next(mode);
    this._isOpen$.next(true);
  }

  close() {
    this._isOpen$.next(false);
  }
}
