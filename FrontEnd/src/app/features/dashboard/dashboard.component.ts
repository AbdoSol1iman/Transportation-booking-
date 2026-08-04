import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { StationService } from '../../core/services/station.service';
import { TripService } from '../../core/services/trip.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { BookingService } from '../../core/services/booking.service';
import { UserService } from '../../core/services/user.service';
import { RouteService } from '../../core/services/route.service';
import { DriverService } from '../../core/services/driver.service';
import { AuthService } from '../../core/services/auth.service';
import { Station } from '../../core/models/station.model';
import { Trip } from '../../core/models/trip.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { Route } from '../../core/models/route.model';
import { Driver } from '../../core/models/driver.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private stationService = inject(StationService);
  private tripService = inject(TripService);
  private vehicleService = inject(VehicleService);
  private bookingService = inject(BookingService);
  private userService = inject(UserService);
  private routeService = inject(RouteService);
  private driverService = inject(DriverService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // Active Sidebar Tab
  activeTab: 'overview' | 'trips' | 'stations' | 'vehicles' | 'routes' | 'drivers' | 'users' = 'overview';

  // Counts
  totalStations = 0;
  totalTrips = 0;
  totalVehicles = 0;
  totalBookings = 0;
  totalUsers = 0;
  totalRoutes = 0;
  totalDrivers = 0;

  // Data Arrays
  stationsList: Station[] = [];
  tripsList: Trip[] = [];
  vehiclesList: Vehicle[] = [];
  routesList: Route[] = [];
  driversList: Driver[] = [];
  usersList: User[] = [];

  isLoading = true;

  // Modals visibility
  showAddStationModal = false;
  showAddVehicleModal = false;
  showAddRouteModal = false;
  showAddDriverModal = false;
  showAddTripModal = false;
  showEditTripModal = false;
  isSubmitting = false;

  // Form Models
  newStation = { name: '', city: '', address: '', latitude: 30.0444, longitude: 31.2357 };
  newVehicle = { plateNumber: '', model: '', capacity: 14, vehicleType: 'minibus' as 'bus' | 'minibus' | 'van' };
  newRoute = { startStationId: '', endStationId: '', distance: 150, estimatedDuration: 120 };
  newDriver = { fullName: '', phone: '', licenseNumber: '', experienceYears: 5 };
  newTrip = { routeId: '', vehicleId: '', driverId: '', departureTime: '', arrivalTime: '', price: 150, capacity: 14 };

  editingTripId: string | null = null;
  editingTrip = { routeId: '', vehicleId: '', driverId: '', departureTime: '', arrivalTime: '', price: 150, capacity: 14 };

  cardImages: string[] = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
  ];

  ngOnInit(): void {
    this.fetchAllData();
  }

  setTab(tab: 'overview' | 'trips' | 'stations' | 'vehicles' | 'routes' | 'drivers' | 'users'): void {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  fetchAllData(): void {
    this.isLoading = true;

    this.stationService.getStations().subscribe((res) => {
      this.stationsList = res.data || [];
      this.totalStations = this.stationsList.length;
      this.cdr.detectChanges();
    });

    this.tripService.getTrips().subscribe((res) => {
      this.tripsList = res.data || [];
      this.totalTrips = this.tripsList.length;
      this.cdr.detectChanges();
    });

    this.vehicleService.getVehicles().subscribe((res) => {
      this.vehiclesList = res.data || [];
      this.totalVehicles = this.vehiclesList.length;
      this.cdr.detectChanges();
    });

    this.routeService.getRoutes().subscribe((res) => {
      this.routesList = res.data || [];
      this.totalRoutes = this.routesList.length;
      this.cdr.detectChanges();
    });

    this.driverService.getDrivers().subscribe((res) => {
      this.driversList = res.data || [];
      this.totalDrivers = this.driversList.length;
      this.cdr.detectChanges();
    });

    this.userService.getUsers().subscribe((res) => {
      this.usersList = res.data || [];
      this.totalUsers = this.usersList.length;
      this.cdr.detectChanges();
    });

    this.bookingService.getMyBookings().subscribe({
      next: (res) => {
        this.totalBookings = res.data?.length || 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Quick Action Handlers
  createStation(): void {
    if (!this.newStation.name || !this.newStation.city) {
      alert('يرجى ملء اسم المحطة والمدينة.');
      return;
    }
    this.isSubmitting = true;
    this.stationService.createStation({
      name: this.newStation.name,
      city: this.newStation.city,
      address: this.newStation.address,
      latitude: Number(this.newStation.latitude),
      longitude: Number(this.newStation.longitude),
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showAddStationModal = false;
        this.newStation = { name: '', city: '', address: '', latitude: 30.0444, longitude: 31.2357 };
        alert('تم إضافة الموقف بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        alert(err?.error?.message || 'تعذر إضافة الموقف.');
      },
    });
  }

  deleteStation(id: string): void {
    if (confirm('هل أنت تأكد من حذف المحطة؟')) {
      this.stationService.deleteStation(id).subscribe(() => this.fetchAllData());
    }
  }

  createVehicle(): void {
    if (!this.newVehicle.plateNumber || !this.newVehicle.model) {
      alert('يرجى ملء رقم اللوحة والموديل.');
      return;
    }
    this.isSubmitting = true;
    this.vehicleService.createVehicle({
      plateNumber: this.newVehicle.plateNumber,
      model: this.newVehicle.model,
      capacity: Number(this.newVehicle.capacity),
      vehicleType: this.newVehicle.vehicleType,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showAddVehicleModal = false;
        this.newVehicle = { plateNumber: '', model: '', capacity: 14, vehicleType: 'minibus' };
        alert('تم إضافة المركبة بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        alert(err?.error?.message || 'تعذر إضافة المركبة.');
      },
    });
  }

  deleteVehicle(id: string): void {
    if (confirm('هل أنت تأكد من حذف المركبة؟')) {
      this.vehicleService.deleteVehicle(id).subscribe(() => this.fetchAllData());
    }
  }

  createRoute(): void {
    if (!this.newRoute.startStationId || !this.newRoute.endStationId) {
      alert('يرجى اختيار محطة القيام والوصول.');
      return;
    }
    this.isSubmitting = true;
    this.routeService.createRoute({
      startStationId: this.newRoute.startStationId as any,
      endStationId: this.newRoute.endStationId as any,
      distance: Number(this.newRoute.distance),
      estimatedDuration: Number(this.newRoute.estimatedDuration),
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showAddRouteModal = false;
        this.newRoute = { startStationId: '', endStationId: '', distance: 150, estimatedDuration: 120 };
        alert('تم إضافة خط السير بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        alert(err?.error?.message || 'تعذر إضافة خط السير.');
      },
    });
  }

  deleteRoute(id: string): void {
    if (confirm('هل أنت تأكد من حذف خط السير؟')) {
      this.routeService.deleteRoute(id).subscribe(() => this.fetchAllData());
    }
  }

  createDriver(): void {
    if (!this.newDriver.fullName || !this.newDriver.phone || !this.newDriver.licenseNumber) {
      alert('يرجى ملء الاسم الكامل والتليفون ورقم الرخصة.');
      return;
    }
    this.isSubmitting = true;
    this.driverService.createDriver({
      fullName: this.newDriver.fullName,
      phone: this.newDriver.phone,
      licenseNumber: this.newDriver.licenseNumber,
      experienceYears: Number(this.newDriver.experienceYears),
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showAddDriverModal = false;
        this.newDriver = { fullName: '', phone: '', licenseNumber: '', experienceYears: 5 };
        alert('تم إضافة السائق بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        alert(err?.error?.message || 'تعذر إضافة السائق.');
      },
    });
  }

  deleteDriver(id: string): void {
    if (confirm('هل أنت تأكد من حذف السائق؟')) {
      this.driverService.deleteDriver(id).subscribe(() => this.fetchAllData());
    }
  }

  createTrip(): void {
    if (!this.newTrip.routeId || !this.newTrip.vehicleId || !this.newTrip.driverId || !this.newTrip.departureTime || !this.newTrip.arrivalTime) {
      alert('يرجى ملء جميع حقول الرحلة المطلوبة.');
      return;
    }
    this.isSubmitting = true;
    this.tripService.createTrip({
      routeId: this.newTrip.routeId as any,
      vehicleId: this.newTrip.vehicleId as any,
      driverId: this.newTrip.driverId as any,
      departureTime: new Date(this.newTrip.departureTime).toISOString(),
      arrivalTime: new Date(this.newTrip.arrivalTime).toISOString(),
      price: Number(this.newTrip.price),
      capacity: Number(this.newTrip.capacity),
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showAddTripModal = false;
        alert('تم إضافة الرحلة الجديدة بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        alert(err?.error?.message || 'تعذر إضافة الرحلة.');
      },
    });
  }

  openEditTripModal(trip: Trip): void {
    this.editingTripId = trip._id || null;
    const rId = typeof trip.routeId === 'object' ? trip.routeId._id : trip.routeId;
    const vId = typeof trip.vehicleId === 'object' ? trip.vehicleId._id : trip.vehicleId;
    const dId = typeof trip.driverId === 'object' ? trip.driverId._id : trip.driverId;

    let depStr = '';
    let arrStr = '';
    try {
      if (trip.departureTime) depStr = new Date(trip.departureTime).toISOString().slice(0, 16);
      if (trip.arrivalTime) arrStr = new Date(trip.arrivalTime).toISOString().slice(0, 16);
    } catch {}

    this.editingTrip = {
      routeId: rId || '',
      vehicleId: vId || '',
      driverId: dId || '',
      departureTime: depStr,
      arrivalTime: arrStr,
      price: trip.price || 150,
      capacity: trip.capacity || 14,
    };
    this.showEditTripModal = true;
    this.cdr.detectChanges();
  }

  updateTrip(): void {
    if (!this.editingTripId) return;
    this.isSubmitting = true;
    const depISO = this.editingTrip.departureTime ? new Date(this.editingTrip.departureTime).toISOString() : undefined;
    const arrISO = this.editingTrip.arrivalTime ? new Date(this.editingTrip.arrivalTime).toISOString() : undefined;

    this.tripService.updateTrip(this.editingTripId, {
      routeId: this.editingTrip.routeId as any,
      vehicleId: this.editingTrip.vehicleId as any,
      driverId: this.editingTrip.driverId as any,
      departureTime: depISO,
      arrivalTime: arrISO,
      price: Number(this.editingTrip.price),
      capacity: Number(this.editingTrip.capacity),
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showEditTripModal = false;
        alert('تم تعديل بيانات الرحلة بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        alert(err?.error?.message || 'تعذر تعديل الرحلة.');
        this.cdr.detectChanges();
      },
    });
  }

  deleteTrip(id: string): void {
    if (confirm('هل أنت تأكد من حذف الرحلة؟')) {
      this.tripService.deleteTrip(id).subscribe(() => this.fetchAllData());
    }
  }

  // Display Helper Methods
  getStartStationName(trip: Trip): string {
    if (trip && trip.routeId && typeof trip.routeId === 'object') {
      const start = (trip.routeId as any).startStationId;
      if (start && typeof start === 'object') return start.name || start.city || 'محطة القيام';
      if (typeof start === 'string') return start;
    }
    return 'محطة القيام';
  }

  getEndStationName(trip: Trip): string {
    if (trip && trip.routeId && typeof trip.routeId === 'object') {
      const end = (trip.routeId as any).endStationId;
      if (end && typeof end === 'object') return end.name || end.city || 'محطة الوصول';
      if (typeof end === 'string') return end;
    }
    return 'محطة الوصول';
  }

  getRouteLabel(r: Route): string {
    if (r.startStationId && r.endStationId) {
      const sName = (r.startStationId as any).name || (r.startStationId as any).city || 'بداية';
      const eName = (r.endStationId as any).name || (r.endStationId as any).city || 'نهاية';
      return `${sName} ➔ ${eName}`;
    }
    return 'خط سير';
  }

  getTripImage(index: number): string {
    return this.cardImages[index % this.cardImages.length];
  }

  logout(): void {
    this.authService.logout();
  }
}
