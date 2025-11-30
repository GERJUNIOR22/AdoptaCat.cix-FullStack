import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  emailVerified?: boolean;
  profileImageUrl?: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
  emailVerified?: boolean;
  profileImageUrl?: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  user = signal<User | null>(null);

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  loginWithCredentials(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((res) => {

          const userData: User = {
            id: res.id,
            name: res.name,
            email: res.email,
            role: res.role,
            isAdmin: res.isAdmin,
            emailVerified: res.emailVerified,
            profileImageUrl: res.profileImageUrl,
          };

          this.user.set(userData);
          localStorage.setItem('user', JSON.stringify(userData));

          localStorage.setItem('token', res.token);
        })
      );
  }

  login(userData: User, token?: string) {
    this.user.set(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return this.user() !== null && !!this.getToken();
  }

  isAdmin() {
    const currentUser = this.user();
    return currentUser ? currentUser.isAdmin : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.user();
  }
}