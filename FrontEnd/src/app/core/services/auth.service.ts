import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

export interface AuthResponse {
  token: string;
  user: User;
  data?: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: { email?: string; password?: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.success) {
          const token = res.token || res.data?.token;
          const user = res.data || res.user;
          if (token && user) {
            this.setSession(token, user);
          }
        }
      })
    );
  }

  register(userData: Partial<User>): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => {
        if (res.success) {
          const token = res.token || res.data?.token;
          const user = res.data || res.user;
          if (token && user) {
            this.setSession(token, user);
          }
        }
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null') {
        return token;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isPassenger(): boolean {
    const role = this.getUserRole();
    return role === 'passenger' || !role;
  }

  isDriver(): boolean {
    return this.getUserRole() === 'driver';
  }

  private setSession(token: string, user: User): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): User | null {
    if (typeof localStorage !== 'undefined') {
      try {
        const user = localStorage.getItem('user');
        if (!user || user === 'undefined' || user === 'null') {
          return null;
        }
        return JSON.parse(user);
      } catch {
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }
}
