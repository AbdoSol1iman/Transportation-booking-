import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { DriverService } from '../../../core/services/driver.service';
import { AlertService } from '../../../core/services/alert.service';
import { Driver } from '../../../core/models/driver.model';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.css',
})
export class DriverListComponent implements OnInit {
  private driverService = inject(DriverService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  drivers: Driver[] = [];
  isLoading = true;
  errorMessage = '';

  showAddModal = false;
  showEditModal = false;
  isSubmitting = false;

  newDriver = {
    fullName: '',
    phone: '',
    licenseNumber: '',
    experienceYears: 5,
  };

  editingDriverId: string | null = null;
  editingDriver = {
    fullName: '',
    phone: '',
    licenseNumber: '',
    experienceYears: 5,
  };

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.driverService.getDrivers().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.drivers = res?.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'تعذر جلب السائقين من الباك إند.';
        this.cdr.detectChanges();
      },
    });
  }

  createDriver(): void {
    if (!this.newDriver.fullName || !this.newDriver.phone || !this.newDriver.licenseNumber) {
      this.alertService.warning('تنبيه', 'يرجى ملء الاسم الكامل، رقم الهاتف، ورقم الرخصة.');
      return;
    }

    this.isSubmitting = true;

    this.driverService
      .createDriver({
        fullName: this.newDriver.fullName,
        phone: this.newDriver.phone,
        licenseNumber: this.newDriver.licenseNumber,
        experienceYears: Number(this.newDriver.experienceYears),
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showAddModal = false;
          this.newDriver = { fullName: '', phone: '', licenseNumber: '', experienceYears: 5 };
          this.alertService.success('تم الإضافة! 👨‍✈️', 'تم إضافة السائق جديد بنجاح!');
          this.fetchDrivers();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.alertService.error('خطأ', err?.error?.message || 'تعذر إضافة السائق.');
          this.cdr.detectChanges();
        },
      });
  }

  openEditModal(driver: Driver): void {
    this.editingDriverId = driver._id || null;
    this.editingDriver = {
      fullName: driver.fullName || '',
      phone: driver.phone || '',
      licenseNumber: driver.licenseNumber || '',
      experienceYears: driver.experienceYears || 5,
    };
    this.showEditModal = true;
  }

  updateDriver(): void {
    if (!this.editingDriverId) return;

    this.isSubmitting = true;

    this.driverService
      .updateDriver(this.editingDriverId, {
        fullName: this.editingDriver.fullName,
        phone: this.editingDriver.phone,
        licenseNumber: this.editingDriver.licenseNumber,
        experienceYears: Number(this.editingDriver.experienceYears),
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showEditModal = false;
          this.alertService.success('تم التعديل! ✨', 'تم تعديل بيانات السائق بنجاح!');
          this.fetchDrivers();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.alertService.error('خطأ', err?.error?.message || 'تعذر تعديل السائق.');
          this.cdr.detectChanges();
        },
      });
  }

  async deleteDriver(id: string): Promise<void> {
    const isConfirmed = await this.alertService.confirm('حذف السائق', 'هل أنت متاكد من حذف السائق من السجلات؟', 'نعم، حذف');
    if (isConfirmed) {
      this.driverService.deleteDriver(id).subscribe({
        next: () => {
          this.alertService.toastSuccess('تم حذف السائق بنجاح!');
          this.fetchDrivers();
        },
        error: (err) => {
          this.alertService.error('خطأ', err?.error?.message || 'تعذر حذف السائق.');
        },
      });
    }
  }
}
