import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { TripService } from '../../../core/services/trip.service';
import { RouteService } from '../../../core/services/route.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { DriverService } from '../../../core/services/driver.service';
import { StationService } from '../../../core/services/station.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewService } from '../../../core/services/review.service';
import { AlertService } from '../../../core/services/alert.service';
import { Trip } from '../../../core/models/trip.model';
import { Route } from '../../../core/models/route.model';
import { Vehicle } from '../../../core/models/vehicle.model';
import { Driver } from '../../../core/models/driver.model';
import { Station } from '../../../core/models/station.model';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css',
})
export class TripListComponent implements OnInit {
  private tripService = inject(TripService);
  private routeService = inject(RouteService);
  private vehicleService = inject(VehicleService);
  private driverService = inject(DriverService);
  private stationService = inject(StationService);
  public authService = inject(AuthService);
  private reviewService = inject(ReviewService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  trips: Trip[] = [];
  routes: Route[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  stations: Station[] = [];

  isLoading = true;
  errorMessage = '';

  // Design & Filtering Controls
  viewMode: 'grid' | 'list' = 'grid';
  selectedFromStationId: string = '';
  selectedToStationId: string = '';
  selectedDateFilter: string = '';
  selectedTimeFilter: string = 'all'; // 'all' | 'morning' | 'afternoon' | 'evening' | 'night'
  selectedSort: 'cheapest' | 'fastest' | 'newest' = 'cheapest';
  maxPrice: number = 2000;
  selectedVibe: string = 'all'; // 'all' | 'party' | 'silent' | 'coworking' | 'eco'

  showAddModal = false;
  showEditModal = false;
  isSubmitting = false;

  // ─── Review Display (Accordion per card) ────────────────────────────────
  tripReviews: Record<string, any[]> = {};
  tripReviewsLoading: Record<string, boolean> = {};
  expandedReviewTripId: string | null = null;
  starsArray = [1, 2, 3, 4, 5];

  // ─── Review / Rating Modal ───────────────────────────────────────────────
  showReviewModal = false;
  reviewingTripId: string | null = null;
  reviewingTripLabel: string = '';
  reviewRating: number = 0;
  reviewHoverRating: number = 0;
  reviewComment: string = '';
  isSubmittingReview = false;
  reviewSuccess = false;
  reviewError = '';
  // ─────────────────────────────────────────────────────────────────────────

  newTrip = {
    routeId: '',
    vehicleId: '',
    driverId: '',
    departureTime: '',
    arrivalTime: '',
    price: 150,
    capacity: 14,
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  };

  editingTripId: string | null = null;
  editingTrip = {
    routeId: '',
    vehicleId: '',
    driverId: '',
    departureTime: '',
    arrivalTime: '',
    price: 150,
    capacity: 14,
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  };

  systemDefaultImages: string[] = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
  ];

  ngOnInit(): void {
    this.fetchTrips();
    this.fetchStations();
    if (this.authService.isAdmin()) {
      this.fetchDropdownData();
    }
  }

  fetchTrips(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.tripService.getTrips().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.trips = response?.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.trips = [];
        this.errorMessage = err?.error?.message || 'تعذر الاتصال بسيرفر الباك إند.';
        this.cdr.detectChanges();
      },
    });
  }

  fetchStations(): void {
    this.stationService.getStations().subscribe((res) => {
      this.stations = res.data || [];
      this.cdr.detectChanges();
    });
  }

  fetchDropdownData(): void {
    this.routeService.getRoutes().subscribe((res) => {
      this.routes = res.data || [];
      this.cdr.detectChanges();
    });
    this.vehicleService.getVehicles().subscribe((res) => {
      this.vehicles = res.data || [];
      this.cdr.detectChanges();
    });
    this.driverService.getDrivers().subscribe((res) => {
      this.drivers = res.data || [];
      this.cdr.detectChanges();
    });
  }

  selectVibe(vibe: string): void {
    this.selectedVibe = vibe;
    this.cdr.detectChanges();
  }

  get filteredTrips(): Trip[] {
    let result = [...this.trips];

    // 1. Filter by Start Station
    if (this.selectedFromStationId) {
      result = result.filter((t) => {
        if (t.routeId && typeof t.routeId === 'object') {
          const start = (t.routeId as any).startStationId;
          const sId = typeof start === 'object' ? start._id : start;
          return sId === this.selectedFromStationId;
        }
        return false;
      });
    }

    // 2. Filter by End Station
    if (this.selectedToStationId) {
      result = result.filter((t) => {
        if (t.routeId && typeof t.routeId === 'object') {
          const end = (t.routeId as any).endStationId;
          const eId = typeof end === 'object' ? end._id : end;
          return eId === this.selectedToStationId;
        }
        return false;
      });
    }

    // 3. Filter by Max Price
    result = result.filter((t) => (t.price || 0) <= this.maxPrice);

    // 4. Filter by Date
    if (this.selectedDateFilter) {
      result = result.filter((t) => {
        if (!t.departureTime) return false;
        const tripDateStr = new Date(t.departureTime).toISOString().split('T')[0];
        return tripDateStr === this.selectedDateFilter;
      });
    }

    // 5. Filter by Departure Time Period
    if (this.selectedTimeFilter !== 'all') {
      result = result.filter((t) => {
        if (!t.departureTime) return true;
        const hour = new Date(t.departureTime).getHours();
        if (this.selectedTimeFilter === 'morning') return hour >= 6 && hour < 12;
        if (this.selectedTimeFilter === 'afternoon') return hour >= 12 && hour < 17;
        if (this.selectedTimeFilter === 'evening') return hour >= 17 && hour < 22;
        if (this.selectedTimeFilter === 'night') return hour >= 22 || hour < 6;
        return true;
      });
    }

    // 6. Filter by Energy Level / Vibe Buttons
    if (this.selectedVibe !== 'all') {
      result = result.filter((t) => {
        const vehicle = typeof t.vehicleId === 'object' ? (t.vehicleId as any).vehicleType : '';
        const price = t.price || 0;
        if (this.selectedVibe === 'party') return vehicle === 'minibus' || price >= 300;
        if (this.selectedVibe === 'silent') return vehicle === 'bus' || price <= 200;
        if (this.selectedVibe === 'coworking') return price > 150;
        if (this.selectedVibe === 'eco') return vehicle === 'van' || price <= 180;
        return true;
      });
    }

    // 7. Sort Results
    if (this.selectedSort === 'cheapest') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (this.selectedSort === 'fastest') {
      result.sort((a, b) => {
        const durA = (a.routeId as any)?.estimatedDuration || 0;
        const durB = (b.routeId as any)?.estimatedDuration || 0;
        return durA - durB;
      });
    } else if (this.selectedSort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }

  resetFilters(): void {
    this.selectedFromStationId = '';
    this.selectedToStationId = '';
    this.selectedDateFilter = '';
    this.selectedTimeFilter = 'all';
    this.selectedSort = 'cheapest';
    this.maxPrice = 2000;
    this.selectedVibe = 'all';
    this.cdr.detectChanges();
  }

  // ─── Review Display Methods ───────────────────────────────────────────────
  toggleReviews(tripId: string): void {
    if (this.expandedReviewTripId === tripId) {
      this.expandedReviewTripId = null;
      return;
    }
    this.expandedReviewTripId = tripId;
    if (!this.tripReviews[tripId]) {
      this.loadTripReviews(tripId);
    }
  }

  loadTripReviews(tripId: string): void {
    this.tripReviewsLoading[tripId] = true;
    this.cdr.detectChanges();
    this.reviewService.getReviewsByTrip(tripId).subscribe({
      next: (res) => {
        this.tripReviews[tripId] = res.data || [];
        this.tripReviewsLoading[tripId] = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.tripReviews[tripId] = [];
        this.tripReviewsLoading[tripId] = false;
        this.cdr.detectChanges();
      },
    });
  }

  getAverageRating(tripId: string): number {
    const reviews = this.tripReviews[tripId];
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  getReviewerName(review: any): string {
    if (review.userId && typeof review.userId === 'object') {
      return review.userId.fullName || 'مستخدم';
    }
    return 'مستخدم';
  }

  getReviewerInitial(review: any): string {
    return this.getReviewerName(review).charAt(0).toUpperCase() || 'U';
  }

  formatReviewDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return ''; }
  }
  // ──────────────────────────────────────────────────────────────────────────

  // ─── Review Methods ────────────────────────────────────────────────────────
  openReviewModal(trip: Trip): void {
    this.reviewingTripId = trip._id || null;
    this.reviewingTripLabel = `${this.getStartStationName(trip)} ➔ ${this.getEndStationName(trip)}`;
    this.reviewRating = 0;
    this.reviewHoverRating = 0;
    this.reviewComment = '';
    this.reviewSuccess = false;
    this.reviewError = '';
    this.showReviewModal = true;
    this.cdr.detectChanges();
  }

  setReviewRating(star: number): void {
    this.reviewRating = star;
  }

  hoverStar(star: number): void {
    this.reviewHoverRating = star;
  }

  clearHover(): void {
    this.reviewHoverRating = 0;
  }

  getStarClass(star: number): string {
    const active = this.reviewHoverRating || this.reviewRating;
    return star <= active ? 'text-[#c3f400] drop-shadow-[0_0_8px_rgba(195,244,0,0.8)]' : 'text-zinc-600';
  }

  submitReview(): void {
    if (!this.reviewingTripId || this.reviewRating === 0) {
      this.reviewError = 'يرجى اختيار تقييم من ١ إلى ٥ نجوم أولاً.';
      return;
    }

    this.isSubmittingReview = true;
    this.reviewError = '';

    this.reviewService
      .createReview({
        tripId: this.reviewingTripId,
        rating: this.reviewRating,
        comment: this.reviewComment.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.isSubmittingReview = false;
          this.reviewSuccess = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.showReviewModal = false;
            this.cdr.detectChanges();
          }, 2000);
        },
        error: (err) => {
          this.isSubmittingReview = false;
          this.reviewError = err?.error?.message || 'تعذر إرسال تقييمك. حاول مرة أخرى.';
          this.cdr.detectChanges();
        },
      });
  }
  // ──────────────────────────────────────────────────────────────────────────

  createTrip(): void {
    if (!this.newTrip.routeId || !this.newTrip.vehicleId || !this.newTrip.driverId || !this.newTrip.departureTime || !this.newTrip.arrivalTime) {
      this.alertService.warning('تنبيه', 'يرجى اختيار خط السير والمركبة والسائق وميعاد المغادرة والوصول.');
      return;
    }

    this.isSubmitting = true;

    const depISO = new Date(this.newTrip.departureTime).toISOString();
    const arrISO = new Date(this.newTrip.arrivalTime).toISOString();

    this.tripService
      .createTrip({
        routeId: this.newTrip.routeId as any,
        vehicleId: this.newTrip.vehicleId as any,
        driverId: this.newTrip.driverId as any,
        departureTime: depISO,
        arrivalTime: arrISO,
        price: Number(this.newTrip.price),
        capacity: Number(this.newTrip.capacity),
        imageUrl: this.newTrip.imageUrl || this.systemDefaultImages[0],
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showAddModal = false;
          this.alertService.success('تم الإضافة! 🚍', 'تم إنشاء وتمرير الرحلة الجديدة بنجاح!');
          this.fetchTrips();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.alertService.error('خطأ', err?.error?.message || 'تعذر إنشاء الرحلة.');
          this.cdr.detectChanges();
        },
      });
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

  openEditModal(trip: Trip): void {
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
    this.showEditModal = true;
  }

  updateTrip(): void {
    if (!this.editingTripId) return;

    this.isSubmitting = true;

    const depISO = this.editingTrip.departureTime ? new Date(this.editingTrip.departureTime).toISOString() : undefined;
    const arrISO = this.editingTrip.arrivalTime ? new Date(this.editingTrip.arrivalTime).toISOString() : undefined;

    this.tripService
      .updateTrip(this.editingTripId, {
        routeId: this.editingTrip.routeId as any,
        vehicleId: this.editingTrip.vehicleId as any,
        driverId: this.editingTrip.driverId as any,
        departureTime: depISO,
        arrivalTime: arrISO,
        price: Number(this.editingTrip.price),
        capacity: Number(this.editingTrip.capacity),
        imageUrl: this.editingTrip.imageUrl || this.systemDefaultImages[0],
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showEditModal = false;
          this.alertService.success('تم التعديل! ✨', 'تم تعديل بيانات الرحلة بنجاح!');
          this.fetchTrips();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.alertService.error('خطأ', err?.error?.message || 'تعذر تعديل الرحلة.');
          this.cdr.detectChanges();
        },
      });
  }

  async deleteTrip(id: string): Promise<void> {
    const isConfirmed = await this.alertService.confirm('حذف الرحلة', 'هل أنت متاكد من إغلاق وحذف هذه الرحلة؟', 'نعم، حذف الرحلة');
    if (isConfirmed) {
      this.tripService.deleteTrip(id).subscribe({
        next: () => {
          this.alertService.toastSuccess('تم حذف الرحلة بنجاح!');
          this.fetchTrips();
        },
        error: (err) => {
          this.alertService.error('خطأ', err?.error?.message || 'تعذر حذف الرحلة.');
        },
      });
    }
  }

  getStartStationName(trip: Trip): string {
    if (trip && trip.routeId && typeof trip.routeId === 'object') {
      const start = (trip.routeId as any).startStationId;
      if (start && typeof start === 'object') {
        return start.name || start.city || 'محطة القيام';
      }
      if (typeof start === 'string') return start;
    }
    return 'محطة القيام';
  }

  getEndStationName(trip: Trip): string {
    if (trip && trip.routeId && typeof trip.routeId === 'object') {
      const end = (trip.routeId as any).endStationId;
      if (end && typeof end === 'object') {
        return end.name || end.city || 'محطة الوصول';
      }
      if (typeof end === 'string') return end;
    }
    return 'محطة الوصول';
  }

  getVehicleTitle(trip: Trip): string {
    if (trip && trip.vehicleId && typeof trip.vehicleId === 'object') {
      const vehicle = trip.vehicleId as any;
      return `${vehicle.model || 'مركبة'} (${vehicle.vehicleType || 'مكيفة'})`;
    }
    return 'مركبة VIP مكيفة';
  }

  getAvailableSeats(trip: Trip): number {
    if (!trip) return 0;
    const capacity = trip.capacity || 14;
    const current = trip.currentPassengers || 0;
    return Math.max(0, capacity - current);
  }

  formatTime(dateStr: string | Date): string {
    if (!dateStr) return '08:00 م';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '08:00 م';
    }
  }

  getTripImage(tripOrIndex: any, index?: number): string {
    if (typeof tripOrIndex === 'object' && tripOrIndex?.imageUrl) {
      return tripOrIndex.imageUrl;
    }
    const idx = typeof tripOrIndex === 'number' ? tripOrIndex : (index || 0);
    return this.systemDefaultImages[idx % this.systemDefaultImages.length];
  }

  getRouteLabel(r: Route): string {
    if (r.startStationId && r.endStationId) {
      const sName = (r.startStationId as any).name || (r.startStationId as any).city || 'بداية';
      const eName = (r.endStationId as any).name || (r.endStationId as any).city || 'نهاية';
      return `${sName} ➔ ${eName}`;
    }
    return 'خط سير';
  }

  // ─── Trip Status Helpers ─────────────────────────────────────────────────
  /** Returns true only if the trip can still accept bookings */
  isTripOpen(trip: Trip): boolean {
    const status = (trip as any).status;
    if (status && status !== 'scheduled') return false;
    if (trip.departureTime && new Date(trip.departureTime) <= new Date()) return false;
    return true;
  }

  /** Human-readable Arabic badge label for the trip status */
  getTripStatusBadge(trip: Trip): string {
    const status = (trip as any).status;
    const departed = trip.departureTime && new Date(trip.departureTime) <= new Date();

    if (status === 'fullyBooked') return '🎫 مكتملة المقاعد';
    if (status === 'completed' || departed)  return '✅ انتهت الرحلة';
    if (status === 'inProgress')  return '🚌 في الطريق';
    if (status === 'cancelled')   return '❌ ملغية';
    return '';
  }

  /** Tailwind CSS classes for the status badge */
  getTripStatusClass(trip: Trip): string {
    const status = (trip as any).status;
    const departed = trip.departureTime && new Date(trip.departureTime) <= new Date();

    if (status === 'fullyBooked')           return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (status === 'completed' || departed) return 'bg-zinc-700/60 text-zinc-400 border-zinc-600/40';
    if (status === 'inProgress')            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (status === 'cancelled')             return 'bg-red-500/20 text-red-400 border-red-500/30';
    return '';
  }
  // ─────────────────────────────────────────────────────────────────────────
}
