import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Station } from '../models/station.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stations`;

  getStations(filters?: { city?: string; status?: string; page?: number; limit?: number }): Observable<PaginatedResponse<Station>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.city) params = params.set('city', filters.city);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<PaginatedResponse<Station>>(this.apiUrl, { params });
  }

  getStationById(id: string): Observable<ApiResponse<Station>> {
    return this.http.get<ApiResponse<Station>>(`${this.apiUrl}/${id}`);
  }

  createStation(stationData: Partial<Station> & { latitude?: number; longitude?: number }): Observable<ApiResponse<Station>> {
    return this.http.post<ApiResponse<Station>>(this.apiUrl, stationData);
  }

  updateStation(id: string, stationData: Partial<Station> & { latitude?: number; longitude?: number }): Observable<ApiResponse<Station>> {
    return this.http.patch<ApiResponse<Station>>(`${this.apiUrl}/${id}`, stationData);
  }

  deleteStation(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
