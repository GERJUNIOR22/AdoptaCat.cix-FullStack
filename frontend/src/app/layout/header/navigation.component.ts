import { Component, signal, ViewChild, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginModalComponent } from '../../shared/components/ui/login-modal.component';
import { RegisterModalComponent } from '../../shared/components/ui/register-modal.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginModalComponent,
    RegisterModalComponent,
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  public isOpen = signal(false);
  public menuOpen = signal(false);

  @ViewChild(LoginModalComponent) loginModal!: LoginModalComponent;
  @ViewChild(RegisterModalComponent) registerModal!: RegisterModalComponent;

  constructor(private readonly authService: AuthService) {}

  public user = computed(() => this.authService.user());

  public get userInitials(): string {
    const name = this.user()?.name;
    if (!name) return '';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  }

  public toggleMenu(): void {
    this.isOpen.update(current => !current);
  }

  public closeMenu(): void {
    this.isOpen.set(false);
  }

  public openLoginModal(): void {
    this.openAuthModal('login');
  }

  public openRegisterModal(): void {
    this.openAuthModal('register');
  }

  private openAuthModal(mode: 'login' | 'register'): void {
    if (mode === 'login') {
      this.loginModal.show();
    } else {
      this.registerModal.show();
    }

    if (this.isOpen()) {
      this.closeMenu();
    }
  }

  public toggleUserMenu(): void {
    this.menuOpen.update(current => !current);
  }

  public logout(): void {
    this.authService.logout();
    this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.menuOpen.set(false);
    }
  }
}
