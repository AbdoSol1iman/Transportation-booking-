import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-trip-detail',
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.css'
})
export class TripDetailComponent {
  seatCount: number = 1;
  windowSeatGuarantee: boolean = true;
  basePrice: number = 75;

  get totalPrice(): number {
    let price = this.basePrice * this.seatCount;
    if (this.windowSeatGuarantee) {
      price += 10 * this.seatCount;
    }
    return price;
  }

  incrementSeats() {
    if (this.seatCount < 4) this.seatCount++;
  }

  decrementSeats() {
    if (this.seatCount > 1) this.seatCount--;
  }

  constructor(private router: Router) {}

  goToBooking() {
    this.router.navigate(['/book']);
  }
}
