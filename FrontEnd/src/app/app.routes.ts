import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { StationListComponent } from './features/stations/station-list/station-list.component';
import { RouteListComponent } from './features/routes/route-list/route-list.component';
import { DriverListComponent } from './features/drivers/driver-list/driver-list.component';
import { VehicleListComponent } from './features/vehicles/vehicle-list/vehicle-list.component';
import { TripListComponent } from './features/trips/trip-list/trip-list.component';
import { TripDetailComponent } from './features/trips/trip-detail/trip-detail.component';
import { BookingListComponent } from './features/bookings/booking-list/booking-list.component';
import { BookingFormComponent } from './features/bookings/booking-form/booking-form.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { ReviewListComponent } from './features/reviews/review-list/review-list.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'trips', component: TripListComponent },
  { path: 'trips/:id', component: TripDetailComponent },
  { path: 'trip-detail', component: TripDetailComponent },
  { path: 'reviews', component: ReviewListComponent },

  // Passenger Protected Routes (requires login)
  { path: 'book', component: BookingFormComponent, canActivate: [authGuard] },
  { path: 'bookings', component: BookingListComponent, canActivate: [authGuard] },

  // Admin Protected Routes (requires admin role)
  { path: 'dashboard', component: DashboardComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'users', component: UserListComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'stations', component: StationListComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'routes', component: RouteListComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'vehicles', component: VehicleListComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'drivers', component: DriverListComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },

  // Fallback
  { path: '**', redirectTo: '' },
];
