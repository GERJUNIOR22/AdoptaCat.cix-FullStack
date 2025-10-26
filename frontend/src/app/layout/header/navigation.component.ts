import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginModalComponent } from '../../shared/components/ui/login-modal.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginModalComponent], 
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  // Conversión de useState a Angular Signals
  public isOpen = signal(false);
  
  @ViewChild(LoginModalComponent) loginModal!: LoginModalComponent;

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
   * Abre el modal de login.
   */
  public openLoginModal(): void {
    this.loginModal.show();
    
    if (this.isOpen()) {
      this.closeMenu();
    }
  }
}