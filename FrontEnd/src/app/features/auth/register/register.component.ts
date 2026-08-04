import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  phone = '';
  role = 'passenger';
  password = '';
  isLoading = false;
  errorMessage = '';

  onRegister(): void {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'الرجاء إدخال الاسم، البريد الإلكتروني وكلمة المرور.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .register({
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        role: this.role as any,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.router.navigate(['/trips']);
          } else {
            this.errorMessage = res.message || 'فشل إنشاء الحساب.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'تعذر الاتصال بالخادم. يرجى التحقق وإعادة المحاولة.';
        },
      });
  }
}
