import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css',
})
export class VehicleListComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private cdr = inject(ChangeDetectorRef);

  vehicles: Vehicle[] = [];
  isLoading = true;
  errorMessage = '';

  showAddModal = false;
  showEditModal = false;
  isSubmitting = false;

  newVehicle = {
    plateNumber: '',
    model: '',
    capacity: 14,
    vehicleType: 'minibus' as 'bus' | 'minibus' | 'van',
  };

  editingVehicleId: string | null = null;
  editingVehicle = {
    plateNumber: '',
    model: '',
    capacity: 14,
    vehicleType: 'minibus' as 'bus' | 'minibus' | 'van',
    status: 'active' as 'active' | 'maintenance' | 'inactive',
  };

  ngOnInit(): void {
    this.fetchVehicles();
  }

  fetchVehicles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.vehicleService.getVehicles().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.vehicles = res?.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'تعذر جلب الحافلات والمركبات من الباك إند.';
        this.cdr.detectChanges();
      },
    });
  }

  createVehicle(): void {
    if (!this.newVehicle.plateNumber || !this.newVehicle.model) {
      alert('يرجى ملء رقم اللوحة والموديل.');
      return;
    }

    this.isSubmitting = true;

    this.vehicleService
      .createVehicle({
        plateNumber: this.newVehicle.plateNumber,
        model: this.newVehicle.model,
        capacity: Number(this.newVehicle.capacity),
        vehicleType: this.newVehicle.vehicleType,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showAddModal = false;
          this.newVehicle = { plateNumber: '', model: '', capacity: 14, vehicleType: 'minibus' };
          alert('تم إضافة المركبة بنجاح!');
          this.fetchVehicles();
        },
        error: (err) => {
          this.isSubmitting = false;
          alert(err?.error?.message || 'تعذر إضافة المركبة.');
          this.cdr.detectChanges();
        },
      });
  }

  openEditModal(vehicle: Vehicle): void {
    this.editingVehicleId = vehicle._id || null;
    this.editingVehicle = {
      plateNumber: vehicle.plateNumber || '',
      model: vehicle.model || '',
      capacity: vehicle.capacity || 14,
      vehicleType: (vehicle.vehicleType as any) || 'minibus',
      status: (vehicle.status as any) || 'active',
    };
    this.showEditModal = true;
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
          this.showEditModal = false;
          alert('تم تعديل بيانات المركبة بنجاح!');
          this.fetchVehicles();
        },
        error: (err) => {
          this.isSubmitting = false;
          alert(err?.error?.message || 'تعذر تعديل المركبة.');
          this.cdr.detectChanges();
        },
      });
  }

  deleteVehicle(id: string): void {
    if (confirm('هل أنت تأكد من حذف هذه المركبة؟')) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          alert('تم حذف المركبة بنجاح!');
          this.fetchVehicles();
        },
        error: (err) => {
          alert(err?.error?.message || 'تعذر حذف المركبة.');
        },
      });
    }
  }
}
