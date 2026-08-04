import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Driver } from '../models/driver.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/drivers`;

  getDrivers(filters?: { status?: string; page?: number; limit?: number }): Observable<PaginatedResponse<Driver>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<PaginatedResponse<Driver>>(this.apiUrl, { params });
  }

  getDriverById(id: string): Observable<ApiResponse<Driver>> {
    return this.http.get<ApiResponse<Driver>>(`${this.apiUrl}/${id}`);
  }

  createDriver(driverData: Partial<Driver>): Observable<ApiResponse<Driver>> {
    return this.http.post<ApiResponse<Driver>>(this.apiUrl, driverData);
  }

  updateDriver(id: string, driverData: Partial<Driver>): Observable<ApiResponse<Driver>> {
    return this.http.patch<ApiResponse<Driver>>(`${this.apiUrl}/${id}`, driverData);
  }

  deleteDriver(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
