import { Component, signal, ViewChild, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginModalComponent } from '../../shared/components/ui/login-modal.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginModalComponent],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  public isOpen = signal(false);       // Menú móvil
  public menuOpen = signal(false);     // Menú del usuario logueado

  @ViewChild(LoginModalComponent) loginModal!: LoginModalComponent;

  constructor(private readonly authService: AuthService) {}

  // Computed signal para el usuario
  public user = computed(() => this.authService.user());

  // Getter para las iniciales del usuario
  public get userInitials(): string {
    const name = this.user()?.name;
    if (!name) return '';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  }

  /** Alterna el menú móvil */
  public toggleMenu(): void {
    this.isOpen.update((current) => !current);
  }

  /** Cierra el menú móvil */
  public closeMenu(): void {
    this.isOpen.set(false);
  }

   /** Abre el modal de login */
   public openLoginModal(): void {
     this.openAuthModal('login');
   }

   /** Abre el modal de registro */
   public openRegisterModal(): void {
     this.openAuthModal('register');
   }

   /** Abre el modal de autenticación */
   private openAuthModal(mode: 'login' | 'register'): void {
     this.loginModal.show();
     if (this.isOpen()) {
       this.closeMenu();
     }
   }

  /** Alterna el menú desplegable del usuario */
  public toggleUserMenu(): void {
    this.menuOpen.update((current) => !current);
  }

  /** Cierra sesión */
  public logout(): void {
    this.authService.logout();
    this.menuOpen.set(false);
  }

  /** Cierra el menú del usuario al hacer click fuera */
  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.menuOpen.set(false);
    }
  }
}
