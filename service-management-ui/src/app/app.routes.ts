import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { BookingPageComponent } from './features/booking/booking-page/booking-page';
import { TechnicianComponent } from './features/technician/technician';
import { CustomerDashboardComponent } from './features/booking/customer-dashboard/customer-dashboard';
import { AuthGuard } from './shared/guards/auth.guard';
import { TechnicianDashboardComponent } from './features/technician/technician-dashboard/technician-dashboard';
import { TechnicianProfileComponent } from './features/profile/technician-profile/technician-profile';
import { AssignmentManagementComponent } from './features/admin/assignment-management/assignment-management';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'booking',
    component: BookingPageComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CUSTOMER'] },
  },

  {
    path: 'customer/bookings',
    component: CustomerDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CUSTOMER'] },
  },

  { path: 'technician/onboard', component: TechnicianComponent },

  {
    path: 'technician/dashboard',
    component: TechnicianDashboardComponent,
    // canActivate: [AuthGuard], // Uncomment when auth guard is ready
    // data: { role: 'TECHNICIAN' }
  },

  {
    path: 'technician/profile',
    component: TechnicianProfileComponent,
    // data: { role: 'TECHNICIAN' }
  },
  {
    path: 'admin/assignments',
    component: AssignmentManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'SERVICE_MANAGER'] },
  },
];
