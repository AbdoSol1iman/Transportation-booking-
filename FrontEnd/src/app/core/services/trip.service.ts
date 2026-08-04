import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Trip } from '../models/trip.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/trips`;

  getTrips(filters?: {
    status?: string;
    routeId?: string;
    driverId?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Trip>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.routeId) params = params.set('routeId', filters.routeId);
      if (filters.driverId) params = params.set('driverId', filters.driverId);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<PaginatedResponse<Trip>>(this.apiUrl, { params });
  }

  getTripById(id: string): Observable<ApiResponse<Trip>> {
    return this.http.get<ApiResponse<Trip>>(`${this.apiUrl}/${id}`);
  }

  createTrip(tripData: Partial<Trip>): Observable<ApiResponse<Trip>> {
    return this.http.post<ApiResponse<Trip>>(this.apiUrl, tripData);
  }

  updateTrip(id: string, tripData: Partial<Trip>): Observable<ApiResponse<Trip>> {
    return this.http.patch<ApiResponse<Trip>>(`${this.apiUrl}/${id}`, tripData);
  }

  deleteTrip(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
