import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { AuthModalService } from '../../shared/services/auth-modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  constructor(
    private authService: AuthService,
    private authModalService: AuthModalService,
    private router: Router
  ) {}

  handleServiceClick() {
    // 1. Check if user is logged in
    if (this.authService.isLoggedIn()) { 
      // 2. If logged in, go to booking page
      this.router.navigate(['/booking']);
    } else {
      // 3. If not logged in, open the login modal
      this.authModalService.open('login'); 
    }
  }
}