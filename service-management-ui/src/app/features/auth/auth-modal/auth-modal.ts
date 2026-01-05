import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalService } from '../../../shared/services/auth-modal.service';
import { LoginComponent } from '../login/login';
import { RegisterComponent } from '../register/register';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './auth-modal.html',
  styleUrls: ['./auth-modal.css']
})
export class AuthModalComponent {

  isOpen$!: Observable<boolean>;
  mode$!: Observable<'login' | 'register'>;

  constructor(private authModal: AuthModalService) {
    this.isOpen$ = this.authModal.isOpen$;
    this.mode$ = this.authModal.mode$;
  }

  close() {
    this.authModal.close();
  }

  switch(mode: 'login' | 'register') {
    this.authModal.open(mode);
  }
}
