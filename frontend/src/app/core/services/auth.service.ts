import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  emailVerified: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;
  private readonly currentUserSubject = new BehaviorSubject<UserInfo | null>(null);

  // Signals para estado reactivo
  isAuthenticated = signal(false);
  currentUser = signal<UserInfo | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    const token = this.getToken();
    const user = this.getStoredUser();

    if (token && user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map(response => {
          // Adaptar respuesta del backend (plana) a la estructura esperada por el frontend
          const user: UserInfo = {
            id: 0, // El backend no devuelve ID por ahora
            email: response.email,
            fullName: response.fullName,
            role: response.role as 'USER' | 'ADMIN',
            isActive: true,
            emailVerified: true
          };

          return {
            token: response.token,
            user: user
          };
        }),
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  logout(): void {
    this.clearAuthData();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN' || false;
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || false;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private setUser(user: UserInfo): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  private getStoredUser(): UserInfo | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  // Observable para suscripciones
  getCurrentUser(): Observable<UserInfo | null> {
    return this.currentUserSubject.asObservable();
  }

  // Verificar estado de admin
  checkAdminRole(): Observable<boolean> {
    // Este endpoint no existe en el backend actual, pero podemos simularlo o implementarlo si es necesario
    // Por ahora, retornamos true si el usuario actual es admin
    return new Observable(observer => {
      observer.next(this.isAdmin());
      observer.complete();
    });
  }

  // Cambiar contraseña
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  // Verificar si el token es válido
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Renovar token si es necesario
  refreshTokenIfNeeded(): void {
    if (!this.isTokenValid()) {
      this.logout();
    }
  }
}