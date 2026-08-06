import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private darkSwal = Swal.mixin({
    background: '#161a1d',
    color: '#ffffff',
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#ef4444',
    customClass: {
      popup: 'border border-white/10 rounded-3xl font-cairo shadow-2xl',
      title: 'text-white font-extrabold text-xl',
      htmlContainer: 'text-zinc-300 font-semibold text-sm',
      confirmButton: 'px-6 py-2.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md transition-all',
      cancelButton: 'px-6 py-2.5 rounded-2xl font-bold text-sm bg-red-600 hover:bg-red-700 shadow-md transition-all mr-2'
    }
  });

  private toastMixin = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    background: '#161a1d',
    color: '#ffffff',
    customClass: {
      popup: 'border border-white/15 rounded-2xl font-cairo shadow-xl text-xs font-bold'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  success(title: string, text?: string): Promise<any> {
    return this.darkSwal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'حسناً',
      iconColor: '#c3f400'
    });
  }

  error(title: string, text?: string): Promise<any> {
    return this.darkSwal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'موافق',
      iconColor: '#f87171'
    });
  }

  warning(title: string, text?: string): Promise<any> {
    return this.darkSwal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonText: 'موافق',
      iconColor: '#fbbf24'
    });
  }

  info(title: string, text?: string): Promise<any> {
    return this.darkSwal.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonText: 'حسناً',
      iconColor: '#60a5fa'
    });
  }

  toast(title: string, icon: SweetAlertIcon = 'success'): void {
    this.toastMixin.fire({
      icon: icon,
      title: title
    });
  }

  toastSuccess(title: string): void {
    this.toast(title, 'success');
  }

  toastError(title: string): void {
    this.toast(title, 'error');
  }

  async confirm(title: string, text: string = '', confirmButtonText: string = 'نعم، تأكيد', cancelButtonText: string = 'إلغاء'): Promise<boolean> {
    const result = await this.darkSwal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      reverseButtons: true,
      iconColor: '#fbbf24'
    });
    return result.isConfirmed;
  }
}
