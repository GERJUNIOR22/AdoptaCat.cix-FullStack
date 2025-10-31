import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  emailVerified?: boolean;
  profileImageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Señal para el usuario
  user = signal<User | null>(null);

  constructor() {
    // Cargar usuario desde localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  login(userData: User) {
    this.user.set(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('user');
  }

  isLoggedIn() {
    return this.user() !== null;
  }

  isAdmin() {
    const currentUser = this.user();
    return currentUser ? currentUser.isAdmin : false;
  }
}
