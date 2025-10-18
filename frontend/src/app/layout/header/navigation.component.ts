import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  // Conversión de useState a Angular Signals
  public isOpen = signal(false);
  public showLoginModal = signal(false);

  /**
   * Alterna el estado del menú móvil.
   */
  public toggleMenu(): void {
    this.isOpen.update((current) => !current);
  }

  /**
   * Cierra el menú móvil.
   */
  public closeMenu(): void {
    this.isOpen.set(false);
  }

  /**
   * Abre el modal de inicio de sesión y cierra el menú móvil si está abierto.
   */
  public openLoginModal(): void {
    this.showLoginModal.set(true);
    if (this.isOpen()) {
      this.closeMenu();
    }
  }

  /**
   * Cierra el modal de inicio de sesión.
   */
  public closeLoginModal(): void {
    this.showLoginModal.set(false);
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   */
  public handleLoginSubmit(event: Event): void {
    event.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log('Login form submitted');
    this.closeLoginModal();
  }

  /**
   * Maneja el enlace a la página de registro.
   */
  public handleRegisterClick(): void {
    this.closeLoginModal();
    // Aquí iría la navegación a la página de registro
    console.log('Navigate to register page');
  }
}