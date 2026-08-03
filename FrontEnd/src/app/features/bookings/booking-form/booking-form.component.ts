import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-booking-form',
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  passengerName: string = 'أحمد محمد علي';
  passengerPhone: string = '01012345678';
  nationalId: string = '29805120101234';
  
  fromStation: string = 'موقف السلام الرئيسي';
  toStation: string = 'الإسكندرية (موقف محرم بك)';
  travelDate: string = '2026-08-03';
  selectedTime: string = '08:30 ص';
  vehicleType: string = 'ميكروباص تويوتا سقف عالي مكيف';
  seatPrice: number = 75;
  
  selectedSeat: number = 4;
  paymentMethod: string = 'cash_station'; // cash_station | vodafone_cash | card

  // 14 microbus seat layout state (true = booked, false = available)
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
    { number: 14, booked: false, label: 'صف خلفي' }
  ];

  constructor(private router: Router) {}

  selectSeat(seatNum: number, isBooked: boolean) {
    if (isBooked || seatNum === 1) return;
    this.selectedSeat = seatNum;
  }

  submitBooking() {
    // Navigate to confirmed booking ticket screen
    this.router.navigate(['/bookings']);
  }
}
