import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalCats: number;
  availableCats: number;
  adoptedCats: number;
  pendingCats: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  emailVerified: boolean;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cat {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  description: string;
  adoptionStatus: 'AVAILABLE' | 'PENDING' | 'ADOPTED' | 'UNAVAILABLE';
  isVaccinated: boolean;
  isSterilized: boolean;
  isSpecialNeeds: boolean;
  activityLevel: string;
  healthStatus: string;
  arrivalDate: string;
  adoptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdoptionApplication {
  id: number;
  applicationNumber: string;
  cat: Cat;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  whyAdopt: string;
  hasCurrentPets: boolean;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  adminNotes?: string;
  reviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  // ============================================
  // DASHBOARD Y ESTADÍSTICAS
  // ============================================

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  getRecentActivity(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard/recent-activity`);
  }

  getAdoptionsByMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/dashboard/adoptions-by-month`);
  }

  // ============================================
  // GESTIÓN DE USUARIOS
  // ============================================

  getUsers(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDirection: string = 'desc'): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<PageResponse<User>>(`${this.baseUrl}/users`, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user);
  }

  changeUserRole(id: number, role: 'USER' | 'ADMIN'): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}/role`, { role });
  }

  toggleUserStatus(id: number): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}/toggle-status`, {});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  // ============================================
  // GESTIÓN DE GATOS
  // ============================================

  getCats(page: number = 0, size: number = 10, sortBy: string = 'name', sortDirection: string = 'asc', status?: string): Observable<PageResponse<Cat>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse<Cat>>(`${this.baseUrl}/cats`, { params });
  }

  batchUpdateCatStatus(catIds: string[], status: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/cats/batch-status`, {
      catIds,
      status
    });
  }

  // ============================================
  // GESTIÓN DE SOLICITUDES
  // ============================================

  getApplications(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDirection: string = 'desc'): Observable<PageResponse<AdoptionApplication>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<PageResponse<AdoptionApplication>>(`${this.baseUrl}/applications/advanced-search`, { params });
  }

  advancedSearchApplications(filters: any, page: number = 0, size: number = 10): Observable<PageResponse<AdoptionApplication>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Agregar filtros dinámicamente
    for (const key of Object.keys(filters)) {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    }

    return this.http.get<PageResponse<AdoptionApplication>>(`${this.baseUrl}/applications/advanced-search`, { params });
  }

  batchProcessApplications(applicationIds: number[], action: string, notes?: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/applications/batch-process`, {
      applicationIds,
      action,
      notes
    });
  }

  // ============================================
  // CONFIGURACIÓN DEL SISTEMA
  // ============================================

  getSystemSettings(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/settings`);
  }

  updateSystemSettings(settings: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/settings`, settings);
  }
}