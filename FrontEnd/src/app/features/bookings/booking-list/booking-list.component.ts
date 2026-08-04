import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent implements OnInit {
  private bookingService = inject(BookingService);
  private cdr = inject(ChangeDetectorRef);

  bookings: Booking[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchMyBookings();
  }

  fetchMyBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.bookingService.getMyBookings().subscribe({
      next: (res) => {
        console.log('✅ My Bookings API Response:', res);
        this.isLoading = false;
        this.bookings = res?.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ My Bookings API Error:', err);
        this.isLoading = false;
        this.bookings = [];
        this.errorMessage = err?.status === 401
          ? 'يرجى تسجيل الدخول لعرض حجوزاتك المسجلة.'
          : (err?.error?.message || 'تعذر استعلام الحجوزات من الخادم.');
        this.cdr.detectChanges();
      },
    });
  }

  cancelBooking(id: string): void {
    if (confirm('هل أنت تأكد من إلغاء هذا الحجز؟')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: () => {
          this.fetchMyBookings();
        },
        error: (err) => {
          alert(err?.error?.message || 'تعذر إلغاء الحجز حالياً.');
        }
      });
    }
  }

  getRouteTitle(booking: Booking): string {
    if (typeof booking.tripId === 'object' && booking.tripId?.routeId) {
      const route = booking.tripId.routeId as any;
      if (route && typeof route === 'object') {
        const start = route.startStationId?.name || route.startStationId?.city || 'محطة القيام';
        const end = route.endStationId?.name || route.endStationId?.city || 'محطة الوصول';
        return `${start} ➔ ${end}`;
      }
    }
    return 'تذكرة سفر مؤكدة';
  }

  getSeatsText(booking: Booking): string {
    if (booking.seatNumbers && booking.seatNumbers.length > 0) {
      return booking.seatNumbers.join(', ');
    }
    return `${booking.passengers || booking.seatsCount || 1} مقعد`;
  }
}
