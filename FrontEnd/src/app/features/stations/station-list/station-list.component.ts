import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { StationService } from '../../../core/services/station.service';
import { AlertService } from '../../../core/services/alert.service';
import { Station } from '../../../core/models/station.model';

@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './station-list.component.html',
  styleUrl: './station-list.component.css',
})
export class StationListComponent implements OnInit {
  private stationService = inject(StationService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  stations: Station[] = [];
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

  showAddModal = false;
  showEditModal = false;

  newStation = {
    name: '',
    city: '',
    address: '',
    latitude: 30.0444,
    longitude: 31.2357,
  };

  editingStationId: string | null = null;
  editingStation = {
    name: '',
    city: '',
    address: '',
    latitude: 30.0444,
    longitude: 31.2357,
  };

  ngOnInit(): void {
    this.fetchStations();
  }

  fetchStations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.stationService.getStations().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.stations = res?.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'تعذر جلب المحطات من الباك إند.';
        this.cdr.detectChanges();
      },
    });
  }

  createStation(): void {
    if (!this.newStation.name || !this.newStation.city) {
      this.alertService.warning('تنبيه', 'يرجى ملء اسم المحطة والمدينة.');
      return;
    }

    this.isSubmitting = true;

    this.stationService
      .createStation({
        name: this.newStation.name,
        city: this.newStation.city,
        address: this.newStation.address,
        latitude: Number(this.newStation.latitude),
        longitude: Number(this.newStation.longitude),
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showAddModal = false;
          this.newStation = { name: '', city: '', address: '', latitude: 30.0444, longitude: 31.2357 };
          this.alertService.success('تم الإضافة! 📍', 'تم إضافة المحطة بنجاح!');
          this.fetchStations();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.alertService.error('خطأ', err?.error?.message || 'تعذر إضافة المحطة.');
          this.cdr.detectChanges();
        },
      });
  }

  openEditModal(station: Station): void {
    this.editingStationId = station._id || null;
    let lat = 30.0444;
    let lng = 31.2357;
    if (station.location && station.location.coordinates) {
      lng = station.location.coordinates[0];
      lat = station.location.coordinates[1];
    }
    this.editingStation = {
      name: station.name || '',
      city: station.city || '',
      address: station.address || '',
      latitude: lat,
      longitude: lng,
    };
    this.showEditModal = true;
  }

  updateStation(): void {
    if (!this.editingStationId) return;

    this.isSubmitting = true;

    this.stationService
      .updateStation(this.editingStationId, {
        name: this.editingStation.name,
        city: this.editingStation.city,
        address: this.editingStation.address,
        latitude: Number(this.editingStation.latitude),
        longitude: Number(this.editingStation.longitude),
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showEditModal = false;
          this.alertService.success('تم التعديل! ✨', 'تم تعديل بيانات المحطة بنجاح!');
          this.fetchStations();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.alertService.error('خطأ', err?.error?.message || 'تعذر تعديل المحطة.');
          this.cdr.detectChanges();
        },
      });
  }

  async deleteStation(id: string): Promise<void> {
    const isConfirmed = await this.alertService.confirm('حذف المحطة', 'هل أنت متاكد من حذف هذه المحطة؟', 'نعم، حذف');
    if (isConfirmed) {
      this.stationService.deleteStation(id).subscribe({
        next: () => {
          this.alertService.toastSuccess('تم حذف المحطة بنجاح!');
          this.fetchStations();
        },
        error: (err) => {
          this.alertService.error('خطأ', err?.error?.message || 'تعذر حذف المحطة.');
        },
      });
    }
  }

  getCoordinates(station: Station): string {
    if (station && station.location && station.location.coordinates) {
      const [lng, lat] = station.location.coordinates;
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    return '30.0444, 31.2357';
  }
}
