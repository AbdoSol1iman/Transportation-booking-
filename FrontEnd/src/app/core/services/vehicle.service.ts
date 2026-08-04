import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vehicle } from '../models/vehicle.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vehicles`;

  getVehicles(filters?: { vehicleType?: string; status?: string; page?: number; limit?: number }): Observable<PaginatedResponse<Vehicle>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.vehicleType) params = params.set('vehicleType', filters.vehicleType);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<PaginatedResponse<Vehicle>>(this.apiUrl, { params });
  }

  getVehicleById(id: string): Observable<ApiResponse<Vehicle>> {
    return this.http.get<ApiResponse<Vehicle>>(`${this.apiUrl}/${id}`);
  }

  createVehicle(vehicleData: Partial<Vehicle>): Observable<ApiResponse<Vehicle>> {
    return this.http.post<ApiResponse<Vehicle>>(this.apiUrl, vehicleData);
  }

  updateVehicle(id: string, vehicleData: Partial<Vehicle>): Observable<ApiResponse<Vehicle>> {
    return this.http.patch<ApiResponse<Vehicle>>(`${this.apiUrl}/${id}`, vehicleData);
  }

  deleteVehicle(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
