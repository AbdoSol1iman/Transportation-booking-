import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { StationService } from '../../core/services/station.service';
import { TripService } from '../../core/services/trip.service';
import { Station } from '../../core/models/station.model';
import { Trip } from '../../core/models/trip.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private stationService = inject(StationService);
  private tripService = inject(TripService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  stations: Station[] = [];
  featuredTrips: Trip[] = [];
  isLoading = true;

  selectedFromStation = '';
  selectedToStation = '';
  selectedSeatsCount = 1;

  cardImages: string[] = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
  ];

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;

    this.stationService.getStations().subscribe({
      next: (res) => {
        this.stations = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {},
    });

    this.tripService.getTrips({ page: 1, limit: 6 }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.featuredTrips = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    this.router.navigate(['/trips'], {
      queryParams: {
        from: this.selectedFromStation || undefined,
        to: this.selectedToStation || undefined,
        seats: this.selectedSeatsCount,
      },
    });
  }

  getRouteStart(trip: Trip): string {
    if (typeof trip.routeId === 'object' && trip.routeId?.startStationId) {
      const s = trip.routeId.startStationId as any;
      return s.name || s.city || 'محطة القيام';
    }
    return 'محطة القيام';
  }

  getRouteEnd(trip: Trip): string {
    if (typeof trip.routeId === 'object' && trip.routeId?.endStationId) {
      const e = trip.routeId.endStationId as any;
      return e.name || e.city || 'محطة الوصول';
    }
    return 'محطة الوصول';
  }

  getVehicleName(trip: Trip): string {
    if (typeof trip.vehicleId === 'object' && trip.vehicleId) {
      const v = trip.vehicleId as any;
      return `${v.model || 'مركبة'} (${v.vehicleType || 'مكيفة'})`;
    }
    return 'مركبة مكيفة VIP';
  }

  getAvailableSeats(trip: Trip): number {
    if (trip.capacity !== undefined && trip.currentPassengers !== undefined) {
      return Math.max(0, trip.capacity - trip.currentPassengers);
    }
    return trip.capacity || 14;
  }

  getTripImage(index: number): string {
    return this.cardImages[index % this.cardImages.length];
  }
}
