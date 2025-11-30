import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): boolean {
    const user = this.authService.user();
    
    // Verificar si el usuario está logueado
    if (!user || !this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    }

    // Verificar si el usuario es administrador
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}