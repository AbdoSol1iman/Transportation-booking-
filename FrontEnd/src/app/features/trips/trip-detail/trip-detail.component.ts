import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { TripService } from '../../../core/services/trip.service';
import { AuthService } from '../../../core/services/auth.service';
import { Trip } from '../../../core/models/trip.model';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.css',
})
export class TripDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripService = inject(TripService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  trip: Trip | null = null;
  isLoading = true;
  errorMessage = '';

  seatCount = 1;

  // Stars array for rating display
  starsArray = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const tripId = params.get('id');
      if (tripId) {
        this.fetchTripDetails(tripId);
      } else {
        this.isLoading = false;
        this.errorMessage = 'رقم الرحلة غير صحيح أو غير محدد.';
        this.cdr.detectChanges();
      }
    });
  }

  fetchTripDetails(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.tripService.getTripById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data) {
          this.trip = res.data;
        } else {
          this.errorMessage = 'لم يتم العثور على تفاصيل الرحلة المطلوب عرضها.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'حدث خطأ في تحميل تفاصيل الرحلة من الباك إند.';
        this.cdr.detectChanges();
      },
    });
  }

  // ─── Trip open/closed logic ─────────────────────────────────────────────
  get isTripOpen(): boolean {
    if (!this.trip) return false;
    const status = (this.trip as any).status;
    if (status && status !== 'scheduled') return false;
    if (this.trip.departureTime && new Date(this.trip.departureTime) <= new Date()) return false;
    return true;
  }

  get tripStatusLabel(): string {
    if (!this.trip) return '';
    const status = (this.trip as any).status;
    const departed = this.trip.departureTime && new Date(this.trip.departureTime) <= new Date();
    if (status === 'fullyBooked') return '🎫 مكتملة المقاعد';
    if (status === 'completed' || departed) return '✅ انتهت الرحلة';
    if (status === 'inProgress') return '🚌 الرحلة في الطريق';
    if (status === 'cancelled') return '❌ الرحلة ملغية';
    if (status === 'scheduled') return '🟢 متاحة للحجز';
    return '';
  }

  get tripStatusClass(): string {
    if (!this.trip) return '';
    const status = (this.trip as any).status;
    const departed = this.trip.departureTime && new Date(this.trip.departureTime) <= new Date();
    if (status === 'fullyBooked') return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    if (status === 'completed' || departed) return 'bg-zinc-700/60 text-zinc-300 border-zinc-600/40';
    if (status === 'inProgress') return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    if (status === 'cancelled') return 'bg-red-500/15 text-red-400 border-red-500/30';
    return 'bg-[#c3f400]/10 text-[#c3f400] border-[#c3f400]/30';
  }

  get closedReason(): string {
    if (!this.trip) return '';
    const status = (this.trip as any).status;
    const departed = this.trip.departureTime && new Date(this.trip.departureTime) <= new Date();
    if (status === 'fullyBooked') return 'هذه الرحلة مكتملة المقاعد ولا يمكن الحجز عليها.';
    if (status === 'completed' || departed) return 'انتهى ميعاد هذه الرحلة ولا يمكن الحجز عليها.';
    if (status === 'inProgress') return 'الرحلة في الطريق حالياً، لا يمكن الحجز.';
    if (status === 'cancelled') return 'هذه الرحلة ملغية ولا يمكن الحجز عليها.';
    return '';
  }
  // ────────────────────────────────────────────────────────────────────────

  get basePrice(): number {
    return this.trip?.price || 0;
  }

  get totalPrice(): number {
    return this.basePrice * this.seatCount;
  }

  incrementSeats(): void {
    const available = this.availableSeats;
    if (this.seatCount < Math.min(6, available)) {
      this.seatCount++;
    }
  }

  decrementSeats(): void {
    if (this.seatCount > 1) this.seatCount--;
  }

  get startStationName(): string {
    if (this.trip?.routeId && typeof this.trip.routeId === 'object') {
      const start = (this.trip.routeId as any).startStationId;
      if (start && typeof start === 'object') return start.name || start.city || 'محطة القيام';
    }
    return 'محطة القيام';
  }

  get endStationName(): string {
    if (this.trip?.routeId && typeof this.trip.routeId === 'object') {
      const end = (this.trip.routeId as any).endStationId;
      if (end && typeof end === 'object') return end.name || end.city || 'محطة الوصول';
    }
    return 'محطة الوصول';
  }

  get vehicleTitle(): string {
    if (this.trip?.vehicleId && typeof this.trip.vehicleId === 'object') {
      const v = this.trip.vehicleId as any;
      return `${v.model || 'مركبة'} — ${v.vehicleType || 'مكيفة'} (${v.plateNumber || ''})`;
    }
    return 'مركبة مكيفة ومريحة';
  }

  get vehicleType(): string {
    if (this.trip?.vehicleId && typeof this.trip.vehicleId === 'object') {
      return (this.trip.vehicleId as any).vehicleType || 'bus';
    }
    return 'bus';
  }

  get driverName(): string {
    if (this.trip?.driverId && typeof this.trip.driverId === 'object') {
      return (this.trip.driverId as any).fullName || 'سائق معتمد';
    }
    return 'سائق معتمد';
  }

  get driverPhone(): string {
    if (this.trip?.driverId && typeof this.trip.driverId === 'object') {
      return (this.trip.driverId as any).phone || '';
    }
    return '';
  }

  get driverRating(): number {
    if (this.trip?.driverId && typeof this.trip.driverId === 'object') {
      return (this.trip.driverId as any).rating || 4.8;
    }
    return 4.8;
  }

  get availableSeats(): number {
    if (!this.trip) return 0;
    return Math.max(0, (this.trip.capacity || 14) - (this.trip.currentPassengers || 0));
  }

  get seatsFilledPercent(): number {
    if (!this.trip || !this.trip.capacity) return 0;
    return Math.round(((this.trip.currentPassengers || 0) / this.trip.capacity) * 100);
  }

  get tripDurationMinutes(): number {
    if (!this.trip?.departureTime || !this.trip?.arrivalTime) return 0;
    const dep = new Date(this.trip.departureTime).getTime();
    const arr = new Date(this.trip.arrivalTime).getTime();
    return Math.round((arr - dep) / 60000);
  }

  get tripDurationLabel(): string {
    const mins = this.tripDurationMinutes;
    if (mins <= 0) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} دقيقة`;
    if (m === 0) return `${h} ساعة`;
    return `${h} ساعة و ${m} دقيقة`;
  }

  formatTime(dateStr?: string | Date): string {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch { return '—'; }
  }

  formatDate(dateStr?: string | Date): string {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return '—'; }
  }

  goToBooking(): void {
    if (!this.trip || !this.isTripOpen) return;
    this.router.navigate(['/book'], {
      queryParams: { tripId: this.trip._id, seats: this.seatCount },
    });
  }
}
