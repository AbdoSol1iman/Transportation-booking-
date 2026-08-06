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
import { AlertService } from '../../core/services/alert.service';
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
  private alertService = inject(AlertService);
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
  showEditVehicleModal = false;
  showAddRouteModal = false;
  showAddDriverModal = false;
  showAddTripModal = false;
  showEditTripModal = false;
  isSubmitting = false;

  // Form Models
  newStation = { name: '', city: '', address: '', latitude: 30.0444, longitude: 31.2357 };
  newVehicle = { plateNumber: '', model: '', capacity: 14, vehicleType: 'minibus' as 'bus' | 'minibus' | 'van', status: 'active' as 'active' | 'maintenance' | 'inactive' };
  editingVehicleId: string | null = null;
  editingVehicle = { plateNumber: '', model: '', capacity: 14, vehicleType: 'minibus' as 'bus' | 'minibus' | 'van', status: 'active' as 'active' | 'maintenance' | 'inactive' };
  newRoute = { startStationId: '', endStationId: '', distance: 150, estimatedDuration: 120 };
  newDriver = { fullName: '', phone: '', licenseNumber: '', experienceYears: 5 };
  newTrip = { routeId: '', vehicleId: '', driverId: '', departureTime: '', arrivalTime: '', price: 150, capacity: 14, imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80' };

  editingTripId: string | null = null;
  editingTrip = { routeId: '', vehicleId: '', driverId: '', departureTime: '', arrivalTime: '', price: 150, capacity: 14, imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80' };

  systemDefaultImages: string[] = [
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
      this.alertService.warning('تنبيه', 'يرجى ملء اسم المحطة والمدينة.');
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
        this.alertService.success('تم الإضافة! 📍', 'تم إضافة الموقف بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.alertService.error('خطأ', err?.error?.message || 'تعذر إضافة الموقف.');
      },
    });
  }

  async deleteStation(id: string): Promise<void> {
    const isConfirmed = await this.alertService.confirm('حذف المحطة', 'هل أنت تأكد من حذف المحطة؟', 'نعم، حذف');
    if (isConfirmed) {
      this.stationService.deleteStation(id).subscribe({
        next: () => {
          this.alertService.toastSuccess('تم حذف المحطة بنجاح');
          this.fetchAllData();
        },
        error: (err) => this.alertService.error('تعذر الحذف', err?.error?.message || 'تعذر حذف المحطة')
      });
    }
  }

  createVehicle(): void {
    if (!this.newVehicle.plateNumber || !this.newVehicle.model) {
      this.alertService.warning('تنبيه', 'يرجى ملء رقم اللوحة والموديل.');
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
        this.newVehicle = { plateNumber: '', model: '', capacity: 14, vehicleType: 'minibus', status: 'active' };
        this.alertService.success('تم الإضافة! 🚌', 'تم إضافة المركبة بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.alertService.error('خطأ', err?.error?.message || 'تعذر إضافة المركبة.');
      },
    });
  }

  async deleteVehicle(id: string): Promise<void> {
    const isConfirmed = await this.alertService.confirm('حذف المركبة', 'هل أنت تأكد من حذف المركبة؟', 'نعم، حذف');
    if (isConfirmed) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.alertService.toastSuccess('تم حذف المركبة بنجاح');
          this.fetchAllData();
        },
        error: (err) => this.alertService.error('تعذر الحذف', err?.error?.message || 'تعذر حذف المركبة')
      });
    }
  }

  openEditVehicleModal(vehicle: Vehicle): void {
    this.editingVehicleId = vehicle._id || null;
    this.editingVehicle = {
      plateNumber: vehicle.plateNumber || '',
      model: vehicle.model || '',
      capacity: vehicle.capacity || 14,
      vehicleType: (vehicle.vehicleType as any) || 'minibus',
      status: (vehicle.status as any) || 'active',
    };
    this.showEditVehicleModal = true;
    this.cdr.detectChanges();
  }

  updateVehicle(): void {
    if (!this.editingVehicleId) return;

    this.isSubmitting = true;
    this.vehicleService
      .updateVehicle(this.editingVehicleId, {
        plateNumber: this.editingVehicle.plateNumber,
        model: this.editingVehicle.model,
        capacity: Number(this.editingVehicle.capacity),
        vehicleType: this.editingVehicle.vehicleType,
        status: this.editingVehicle.status,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showEditVehicleModal = false;
          this.alertService.success('تم التعديل! ✨', 'تم تعديل بيانات المركبة بنجاح!');
          this.fetchAllData();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.alertService.error('خطأ', err?.error?.message || 'تعذر تعديل المركبة.');
          this.cdr.detectChanges();
        },
      });
  }

  createRoute(): void {
    if (!this.newRoute.startStationId || !this.newRoute.endStationId) {
      this.alertService.warning('تنبيه', 'يرجى اختيار محطة القيام والوصول.');
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
        this.alertService.success('تم الإضافة! 🛣️', 'تم إضافة خط السير بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.alertService.error('خطأ', err?.error?.message || 'تعذر إضافة خط السير.');
      },
    });
  }

  async deleteRoute(id: string): Promise<void> {
    const isConfirmed = await this.alertService.confirm('حذف خط السير', 'هل أنت تأكد من حذف خط السير؟', 'نعم، حذف');
    if (isConfirmed) {
      this.routeService.deleteRoute(id).subscribe({
        next: () => {
          this.alertService.toastSuccess('تم حذف خط السير بنجاح');
          this.fetchAllData();
        },
        error: (err) => this.alertService.error('تعذر الحذف', err?.error?.message || 'تعذر حذف خط السير')
      });
    }
  }

  createDriver(): void {
    if (!this.newDriver.fullName || !this.newDriver.phone || !this.newDriver.licenseNumber) {
      this.alertService.warning('تنبيه', 'يرجى ملء الاسم الكامل والتليفون ورقم الرخصة.');
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
        this.alertService.success('تم الإضافة! 👨‍✈️', 'تم إضافة السائق بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.alertService.error('خطأ', err?.error?.message || 'تعذر إضافة السائق.');
      },
    });
  }

  async deleteDriver(id: string): Promise<void> {
    const isConfirmed = await this.alertService.confirm('حذف السائق', 'هل أنت تأكد من حذف السائق؟', 'نعم، حذف');
    if (isConfirmed) {
      this.driverService.deleteDriver(id).subscribe({
        next: () => {
          this.alertService.toastSuccess('تم حذف السائق بنجاح');
          this.fetchAllData();
        },
        error: (err) => this.alertService.error('تعذر الحذف', err?.error?.message || 'تعذر حذف السائق')
      });
    }
  }

  createTrip(): void {
    if (!this.newTrip.routeId || !this.newTrip.vehicleId || !this.newTrip.driverId || !this.newTrip.departureTime || !this.newTrip.arrivalTime) {
      this.alertService.warning('تنبيه', 'يرجى ملء جميع حقول الرحلة المطلوبة.');
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
      imageUrl: this.newTrip.imageUrl || this.systemDefaultImages[0],
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showAddTripModal = false;
        this.alertService.success('تم الإضافة! 🚍', 'تم إضافة الرحلة الجديدة بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.alertService.error('خطأ', err?.error?.message || 'تعذر إضافة الرحلة.');
      },
    });
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
      imageUrl: this.editingTrip.imageUrl || this.systemDefaultImages[0],
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showEditTripModal = false;
        this.alertService.success('تم التعديل! ✨', 'تم تعديل بيانات الرحلة بنجاح!');
        this.fetchAllData();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.alertService.error('خطأ', err?.error?.message || 'تعذر تعديل الرحلة.');
        this.cdr.detectChanges();
      },
    });
  }

  async deleteTrip(id: string): Promise<void> {
    const isConfirmed = await this.alertService.confirm('حذف الرحلة', 'هل أنت متأكد من حذف هذه الرحلة؟', 'نعم، حذف');
    if (isConfirmed) {
      this.tripService.deleteTrip(id).subscribe({
        next: () => {
          this.alertService.toastSuccess('تم حذف الرحلة بنجاح');
          this.fetchAllData();
        },
        error: (err) => this.alertService.error('تعذر الحذف', err?.error?.message || 'تعذر حذف الرحلة')
      });
    }
  }

  formatForDateTimeLocal(dateStr?: string | Date): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  }

  formatDate(dateStr?: string | Date): string {
    if (!dateStr) return 'تاريخ غير محدد';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ar-EG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'تاريخ غير محدد';
    }
  }

  formatTime(dateStr?: string | Date): string {
    if (!dateStr) return '08:00 م';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '08:00 م';
    }
  }

  openEditTripModal(trip: Trip): void {
    this.editingTripId = trip._id || null;
    const rId = typeof trip.routeId === 'object' ? trip.routeId._id : trip.routeId;
    const vId = typeof trip.vehicleId === 'object' ? trip.vehicleId._id : trip.vehicleId;
    const dId = typeof trip.driverId === 'object' ? trip.driverId._id : trip.driverId;

    this.editingTrip = {
      routeId: rId || '',
      vehicleId: vId || '',
      driverId: dId || '',
      departureTime: this.formatForDateTimeLocal(trip.departureTime),
      arrivalTime: this.formatForDateTimeLocal(trip.arrivalTime),
      price: trip.price || 150,
      capacity: trip.capacity || 14,
      imageUrl: trip.imageUrl || this.systemDefaultImages[0],
    };
    this.showEditTripModal = true;
    this.cdr.detectChanges();
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

  getTripImage(tripOrIndex: any, index?: number): string {
    if (typeof tripOrIndex === 'object' && tripOrIndex?.imageUrl) {
      return tripOrIndex.imageUrl;
    }
    const idx = typeof tripOrIndex === 'number' ? tripOrIndex : (index || 0);
    return this.systemDefaultImages[idx % this.systemDefaultImages.length];
  }

  logout(): void {
    this.authService.logout();
  }
}
