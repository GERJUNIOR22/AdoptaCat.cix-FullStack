import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
  emailVerified: boolean;
  profileImageUrl?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
  }

  /**
   * Registrar nuevo usuario
   */
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, userData);
  }

  /**
   * Verificar si el usuario es administrador
   */
  checkAdminRole(email: string): Observable<{ isAdmin: boolean; isActive: boolean }> {
    return this.http.get<{ isAdmin: boolean; isActive: boolean }>(`${this.baseUrl}/check-admin/${email}`);
  }

  /**
   * Cambiar contraseña
   */
  changePassword(request: { email: string; currentPassword: string; newPassword: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/change-password`, request);
  }

  /**
   * Cerrar sesión
   */
  logout(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/logout`, { email });
  }
}