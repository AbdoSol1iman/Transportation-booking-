import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RouteService } from '../../../core/services/route.service';
import { StationService } from '../../../core/services/station.service';
import { Route } from '../../../core/models/route.model';
import { Station } from '../../../core/models/station.model';

@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.css',
})
export class RouteListComponent implements OnInit {
  private routeService = inject(RouteService);
  private stationService = inject(StationService);
  private cdr = inject(ChangeDetectorRef);

  routesList: Route[] = [];
  stations: Station[] = [];
  isLoading = true;
  errorMessage = '';

  showAddModal = false;
  showEditModal = false;
  isSubmitting = false;

  newRoute = {
    startStationId: '',
    endStationId: '',
    distance: 150,
    estimatedDuration: 120,
  };

  editingRouteId: string | null = null;
  editingRoute = {
    startStationId: '',
    endStationId: '',
    distance: 150,
    estimatedDuration: 120,
  };

  ngOnInit(): void {
    this.fetchRoutes();
    this.fetchStations();
  }

  fetchRoutes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.routeService.getRoutes().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.routesList = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.routesList = [];
        this.errorMessage = err?.error?.message || 'تعذر جلب خطوط السير من الباك إند.';
        this.cdr.detectChanges();
      },
    });
  }

  fetchStations(): void {
    this.stationService.getStations().subscribe({
      next: (res) => {
        this.stations = res.data || [];
        this.cdr.detectChanges();
      },
    });
  }

  createRoute(): void {
    if (!this.newRoute.startStationId || !this.newRoute.endStationId) {
      alert('يرجى اختيار محطة القيام ومحطة الوصول.');
      return;
    }

    if (this.newRoute.startStationId === this.newRoute.endStationId) {
      alert('لا يمكن أن تكون محطة القيام هي نفسها محطة الوصول.');
      return;
    }

    this.isSubmitting = true;

    this.routeService
      .createRoute({
        startStationId: this.newRoute.startStationId as any,
        endStationId: this.newRoute.endStationId as any,
        distance: Number(this.newRoute.distance),
        estimatedDuration: Number(this.newRoute.estimatedDuration),
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showAddModal = false;
          this.newRoute = { startStationId: '', endStationId: '', distance: 150, estimatedDuration: 120 };
          alert('تم إضافة خط السير الجديد بنجاح!');
          this.fetchRoutes();
        },
        error: (err) => {
          this.isSubmitting = false;
          alert(err?.error?.message || 'تعذر إضافة خط السير.');
          this.cdr.detectChanges();
        },
      });
  }

  openEditModal(routeItem: Route): void {
    this.editingRouteId = routeItem._id || null;
    const startId = typeof routeItem.startStationId === 'object' ? routeItem.startStationId._id : routeItem.startStationId;
    const endId = typeof routeItem.endStationId === 'object' ? routeItem.endStationId._id : routeItem.endStationId;

    this.editingRoute = {
      startStationId: startId || '',
      endStationId: endId || '',
      distance: routeItem.distance || 150,
      estimatedDuration: routeItem.estimatedDuration || 120,
    };
    this.showEditModal = true;
  }

  updateRoute(): void {
    if (!this.editingRouteId) return;

    this.isSubmitting = true;

    this.routeService
      .updateRoute(this.editingRouteId, {
        startStationId: this.editingRoute.startStationId as any,
        endStationId: this.editingRoute.endStationId as any,
        distance: Number(this.editingRoute.distance),
        estimatedDuration: Number(this.editingRoute.estimatedDuration),
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showEditModal = false;
          alert('تم تعديل خط السير بنجاح!');
          this.fetchRoutes();
        },
        error: (err) => {
          this.isSubmitting = false;
          alert(err?.error?.message || 'تعذر تعديل خط السير.');
          this.cdr.detectChanges();
        },
      });
  }

  deleteRoute(id: string): void {
    if (confirm('هل أنت متاكد من حذف خط السير هذا؟')) {
      this.routeService.deleteRoute(id).subscribe({
        next: () => {
          alert('تم حذف خط السير بنجاح!');
          this.fetchRoutes();
        },
        error: (err) => {
          alert(err?.error?.message || 'تعذر حذف خط السير.');
        },
      });
    }
  }

  getStartName(routeItem: Route): string {
    if (typeof routeItem.startStationId === 'object' && routeItem.startStationId) {
      return routeItem.startStationId.name || routeItem.startStationId.city || 'محطة القيام';
    }
    return 'محطة القيام';
  }

  getEndName(routeItem: Route): string {
    if (typeof routeItem.endStationId === 'object' && routeItem.endStationId) {
      return routeItem.endStationId.name || routeItem.endStationId.city || 'محطة الوصول';
    }
    return 'محطة الوصول';
  }
}
