import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Señal para el usuario
  user = signal<{ name: string, email: string } | null>(null);

  constructor() {
    // Cargar usuario desde localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  login(userData: { name: string, email: string }) {
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
}
