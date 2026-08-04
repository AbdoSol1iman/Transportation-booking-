import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Route } from '../models/route.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/routes`;

  getRoutes(filters?: { status?: string; page?: number; limit?: number }): Observable<PaginatedResponse<Route>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<PaginatedResponse<Route>>(this.apiUrl, { params });
  }

  getRouteById(id: string): Observable<ApiResponse<Route>> {
    return this.http.get<ApiResponse<Route>>(`${this.apiUrl}/${id}`);
  }

  createRoute(routeData: Partial<Route>): Observable<ApiResponse<Route>> {
    return this.http.post<ApiResponse<Route>>(this.apiUrl, routeData);
  }

  updateRoute(id: string, routeData: Partial<Route>): Observable<ApiResponse<Route>> {
    return this.http.patch<ApiResponse<Route>>(`${this.apiUrl}/${id}`, routeData);
  }

  deleteRoute(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
