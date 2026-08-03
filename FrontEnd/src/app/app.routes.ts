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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'stations', component: StationListComponent },
  { path: 'routes', component: RouteListComponent },
  { path: 'drivers', component: DriverListComponent },
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'trips', component: TripListComponent },
  { path: 'trips/:id', component: TripDetailComponent },
  { path: 'trip-detail', component: TripDetailComponent },
  { path: 'book', component: BookingFormComponent },
  { path: 'bookings', component: BookingListComponent },
  { path: 'users', component: UserListComponent },
  { path: 'reviews', component: ReviewListComponent },
  { path: '**', redirectTo: '' }
];





