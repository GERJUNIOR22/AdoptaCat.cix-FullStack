import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isVisible()) {
      <div *ngIf="isVisible()" class="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm" 
          (click)="closeModal()">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" 
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
              <button (click)="closeModal()" 
                      class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-4 text-center">
              Ingresa tus credenciales o usa tu cuenta social
            </p>
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="space-y-4">
              <!-- Email Login Form -->
              <form (ngSubmit)="loginWithEmail()" #emailForm="ngForm">
                <div class="space-y-4">
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      [(ngModel)]="credentials.email"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                      placeholder="tu@email.com">
                  </div>

                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div class="relative">
                      <input 
                        [type]="showPassword() ? 'text' : 'password'"
                        id="password"
                        name="password"
                        [(ngModel)]="credentials.password"
                        required
                        class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                        placeholder="••••••••">
                      <button 
                        type="button"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                        (click)="togglePasswordVisibility()">
                        <svg *ngIf="!showPassword()" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <svg *ngIf="showPassword()" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68"/>
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61"/>
                          <path d="M2 2 22 22"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  @if (loginError()) {
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p class="text-red-600 text-sm">{{ loginError() }}</p>
                    </div>
                  }

                  <button 
                    type="submit"
                    [disabled]="!emailForm.valid || isLoading()"
                    class="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed">
                    @if (isLoading()) {
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Iniciando sesión...
                      </div>
                    } @else {
                      Iniciar Sesión
                    }
                  </button>
                </div>
              </form>

              <!-- Social Login Options -->
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">O continúa con</span>
                </div>
              </div>

              <!-- Google Login -->
              <button class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md"
                      (click)="loginWithGoogle()">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5">
                <span class="font-medium">Continuar con Google</span>
              </button>

              <!-- Facebook Login -->
              <button class="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md"
                      (click)="loginWithFacebook()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span class="font-medium">Continuar con Facebook</span>
              </button>

              <div class="text-center mt-6">
                <p class="text-xs text-gray-500">
                  Al continuar, aceptas nuestros 
                  <a href="#" class="text-rose-600 hover:underline">términos de servicio</a> y 
                  <a href="#" class="text-rose-600 hover:underline">política de privacidad</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LoginModalComponent {
  isVisible = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  loginError = signal<string>('');

  credentials = {
    email: '',
    password: ''
  };

  show() {
    this.isVisible.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isVisible.set(false);
    this.resetForm();
    document.body.style.overflow = 'auto';
  }

  togglePasswordVisibility() {
    this.showPassword.update(current => !current);
  }

  resetForm() {
    this.credentials = { email: '', password: '' };
    this.loginError.set('');
    this.isLoading.set(false);
  }

  // Social Login Methods
  loginWithGoogle() {
    // Redirige al backend para iniciar OAuth2 con Google
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }


  async loginWithFacebook() {
    this.isLoading.set(true);
    try {
      // TODO: Implementar Facebook OAuth
      console.log('Login with Facebook');
      
      // Simulación de login exitoso
      setTimeout(() => {
        this.isLoading.set(false);
        this.closeModal();
        // TODO: Guardar token de usuario y redirigir según el tipo de usuario
        alert('¡Bienvenido! Login con Facebook exitoso (demo)');
      }, 2000);
      
    } catch (error) {
      this.isLoading.set(false);
      console.error('Error logging in with Facebook:', error);
    }
  }

  // Email/Password Login
  async loginWithEmail() {
    if (!this.credentials.email || !this.credentials.password) {
      this.loginError.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.loginError.set('');

    try {
      // TODO: Implementar llamada a API de login
      console.log('Email login:', this.credentials);
      
      // Simulación de login - el backend determinará si es admin o usuario normal
      setTimeout(() => {
        this.isLoading.set(false);
        this.closeModal();
        
        // TODO: Aquí el backend responderá con el tipo de usuario
        // Si es admin, redirigir al panel de admin
        // Si es usuario normal, mantener en la página actual
        
        // Demo: simular que algunos emails son de admin
        const adminEmails = ['admin@adoptacat.org', 'gerencia@adoptacat.org', 'director@adoptacat.org'];
        if (adminEmails.includes(this.credentials.email.toLowerCase())) {
          alert('¡Bienvenido Administrador! Redirigiendo al panel de admin (demo)');
          // TODO: Redirigir al panel de admin
        } else {
          alert('¡Bienvenido! Login exitoso (demo)');
          // TODO: Mantener en la página actual como usuario normal
        }
      }, 2000);
      
    } catch (error) {
      this.isLoading.set(false);
      this.loginError.set('Error al iniciar sesión. Verifica tus credenciales.');
      console.error('Error logging in:', error);
    }

    
  }
}