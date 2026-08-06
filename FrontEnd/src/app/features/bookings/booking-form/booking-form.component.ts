import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { TripService } from '../../../core/services/trip.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { Trip } from '../../../core/models/trip.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css',
})
export class BookingFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripService = inject(TripService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  tripId: string | null = null;
  trip: Trip | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

  passengerName = '';
  passengerPhone = '';
  nationalId = '';

  fromStation = 'موقف القيام';
  toStation = 'موقف الوصول';
  travelDate = '';
  selectedTime = '';
  vehicleType = 'مركبة مكيفة';
  seatPrice = 0;

  selectedSeat = 4;
  seatsCount = 1;
  paymentMethod = 'cash_station';

  seats = [
    { number: 1, booked: true, label: 'سائق' },
    { number: 2, booked: false, label: 'بجوار السائق' },
    { number: 3, booked: false, label: 'بجوار السائق' },
    { number: 4, booked: false, label: 'صف 1 - شباك' },
    { number: 5, booked: false, label: 'صف 1 - وسط' },
    { number: 6, booked: true, label: 'صف 1 - ممر' },
    { number: 7, booked: false, label: 'صف 2 - شباك' },
    { number: 8, booked: false, label: 'صف 2 - وسط' },
    { number: 9, booked: true, label: 'صف 2 - ممر' },
    { number: 10, booked: false, label: 'صف 3 - شباك' },
    { number: 11, booked: false, label: 'صف 3 - وسط' },
    { number: 12, booked: false, label: 'صف 3 - ممر' },
    { number: 13, booked: false, label: 'صف خلفي' },
    { number: 14, booked: false, label: 'صف خلفي' },
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser$;
    user.subscribe((u) => {
      if (u) {
        this.passengerName = u.fullName || '';
        this.passengerPhone = u.phone || '';
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      this.tripId = params.get('tripId');
      const seatsParam = params.get('seats');
      if (seatsParam) {
        this.seatsCount = parseInt(seatsParam, 10) || 1;
      }

      if (this.tripId) {
        this.fetchTrip(this.tripId);
      } else {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchTrip(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.tripService.getTripById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data) {
          this.trip = res.data;
          this.populateTripDetails(res.data);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'تعذر تحميل بيانات الرحلة لعمل الحجز.';
        this.cdr.detectChanges();
      },
    });
  }

  private populateTripDetails(trip: Trip): void {
    this.seatPrice = trip.price || 0;

    if (trip.routeId && typeof trip.routeId === 'object') {
      const start = (trip.routeId as any).startStationId;
      const end = (trip.routeId as any).endStationId;

      if (start && typeof start === 'object') {
        this.fromStation = start.name || start.city || 'موقف القيام';
      }
      if (end && typeof end === 'object') {
        this.toStation = end.name || end.city || 'موقف الوصول';
      }
    }

    if (trip.vehicleId && typeof trip.vehicleId === 'object') {
      const vehicle = trip.vehicleId as any;
      this.vehicleType = `${vehicle.model || 'مركبة'} (${vehicle.vehicleType || 'مكيفة'})`;
    }

    if (trip.departureTime) {
      try {
        const date = new Date(trip.departureTime);
        this.selectedTime = date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        this.travelDate = date.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
      } catch {}
    }
  }

  selectSeat(seatNum: number, isBooked: boolean): void {
    if (isBooked || seatNum === 1) return;
    this.selectedSeat = seatNum;
  }

  get totalAmount(): number {
    return this.seatPrice * this.seatsCount;
  }

  submitBooking(): void {
    if (!this.authService.isLoggedIn()) {
      this.alertService.warning('تنبيه', 'يرجى تسجيل الدخول أولاً لإتمام الحجز.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.tripId) {
      this.alertService.error('خطأ', 'الرحلة غير محددة بشكل صحيح.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    let backendPayment: 'cash' | 'card' | 'wallet' = 'cash';
    if (this.paymentMethod === 'vodafone_cash') backendPayment = 'wallet';
    else if (this.paymentMethod === 'card') backendPayment = 'card';
    else backendPayment = 'cash';

    this.bookingService
      .createBooking({
        tripId: this.tripId,
        passengers: this.seatsCount || 1,
        paymentMethod: backendPayment,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.alertService.success('تم الحجز بنجاح! 🎫', 'تم إنشاء وتأكيد حجزك بنجاح!');
          this.router.navigate(['/bookings']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'تعذر إتمام الحجز. يرجى التأكد من تسجيل الدخول والمحاولة مجدداً.';
          this.alertService.error('تعذر إتمام الحجز', this.errorMessage);
          this.cdr.detectChanges();
        },
      });
  }
}
