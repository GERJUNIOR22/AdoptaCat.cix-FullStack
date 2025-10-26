import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type LoginMode = 'user' | 'admin';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isVisible()) {
      <div class="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm" 
           (click)="closeModal()">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" 
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ loginMode() === 'user' ? 'Iniciar Sesión' : 'Admin Login' }}
              </h2>
              <button (click)="closeModal()" 
                      class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            
            <!-- Mode Toggle -->
            @if (showAdminMode()) {
              <div class="flex mt-4 bg-gray-100 rounded-lg p-1">
                <button 
                  class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200"
                  [class]="loginMode() === 'user' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                  (click)="setLoginMode('user')">
                  👤 Usuario
                </button>
                <button 
                  class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200"
                  [class]="loginMode() === 'admin' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                  (click)="setLoginMode('admin')">
                  🔐 Admin
                </button>
              </div>
            } @else {
              <p class="text-sm text-gray-500 mt-4 text-center">
                Accede con tu cuenta social favorita
              </p>
            }
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- User Login (Social Only) -->
            @if (loginMode() === 'user') {
              <div class="space-y-4">
                <p class="text-gray-600 text-center mb-6">
                  Accede rápidamente con tu cuenta favorita
                </p>
                
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
                    <a href="#" class="text-purple-600 hover:underline">términos de servicio</a> y 
                    <a href="#" class="text-purple-600 hover:underline">política de privacidad</a>
                  </p>
                </div>
              </div>
            }

            <!-- Admin Login (Traditional) -->
            @if (loginMode() === 'admin') {
              <form (ngSubmit)="loginAdmin()" #adminForm="ngForm">
                <div class="space-y-4">
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      Email de Administrador
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      [(ngModel)]="adminCredentials.email"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="admin@adoptacat.org">
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
                        [(ngModel)]="adminCredentials.password"
                        required
                        class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                    [disabled]="!adminForm.valid || isLoading()"
                    class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed">
                    @if (isLoading()) {
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Iniciando sesión...
                      </div>
                    } @else {
                      Iniciar Sesión
                    }
                  </button>

                  <div class="text-center">
                    <button 
                      type="button"
                      class="text-sm text-purple-600 hover:text-purple-800 underline"
                      (click)="showAdminRegistration.set(true)">
                      ¿Necesitas crear una cuenta de administrador?
                    </button>
                  </div>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    }

    <!-- Admin Registration Modal -->
    @if (showAdminRegistration()) {
      <div class="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center backdrop-blur-sm" 
           (click)="showAdminRegistration.set(false)">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" 
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-900">Registro de Administrador</h2>
              <button (click)="showAdminRegistration.set(false)" 
                      class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Registration Form -->
          <div class="p-6">
            <form (ngSubmit)="registerAdmin()" #regForm="ngForm">
              <div class="space-y-4">
                <div>
                  <label for="regName" class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input 
                    type="text" 
                    id="regName"
                    name="regName"
                    [(ngModel)]="adminRegister.name"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tu nombre completo">
                </div>

                <div>
                  <label for="regEmail" class="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="regEmail"
                    name="regEmail"
                    [(ngModel)]="adminRegister.email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="tu.email@adoptacat.org">
                </div>

                <div>
                  <label for="regPassword" class="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input 
                    type="password"
                    id="regPassword"
                    name="regPassword"
                    [(ngModel)]="adminRegister.password"
                    required
                    minlength="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Mínimo 6 caracteres">
                </div>

                <div>
                  <label for="regPasswordConfirm" class="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input 
                    type="password"
                    id="regPasswordConfirm"
                    name="regPasswordConfirm"
                    [(ngModel)]="adminRegister.passwordConfirm"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Repite tu contraseña">
                </div>

                @if (registerError()) {
                  <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p class="text-red-600 text-sm">{{ registerError() }}</p>
                  </div>
                }

                <button 
                  type="submit"
                  [disabled]="!regForm.valid || isLoading()"
                  class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed">
                  @if (isLoading()) {
                    <div class="flex items-center justify-center gap-2">
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando cuenta...
                    </div>
                  } @else {
                    Crear Cuenta de Admin
                  }
                </button>

                <div class="text-center">
                  <button 
                    type="button"
                    class="text-sm text-gray-600 hover:text-gray-800 underline"
                    (click)="showAdminRegistration.set(false)">
                    Volver al login
                  </button>
                </div>
              </div>
            </form>
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
  loginMode = signal<LoginMode>('user');
  showPassword = signal<boolean>(false);
  showAdminRegistration = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  loginError = signal<string>('');
  registerError = signal<string>('');
  showAdminMode = signal<boolean>(false); // Controla si se muestra el botón Admin

  adminCredentials = {
    email: '',
    password: ''
  };

  adminRegister = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  show() {
    this.isVisible.set(true);
    this.loginMode.set('user'); // Siempre empezar en modo usuario
    this.showAdminMode.set(false); // Ocultar admin por defecto
    document.body.style.overflow = 'hidden';
  }

  showWithAdminAccess() {
    this.isVisible.set(true);
    this.showAdminMode.set(true); // Mostrar opción admin
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isVisible.set(false);
    this.showAdminRegistration.set(false);
    this.showAdminMode.set(false); // Reset admin mode
    this.resetForms();
    document.body.style.overflow = 'auto';
  }

  setLoginMode(mode: LoginMode) {
    this.loginMode.set(mode);
    this.resetForms();
  }

  togglePasswordVisibility() {
    this.showPassword.update(current => !current);
  }

  resetForms() {
    this.adminCredentials = { email: '', password: '' };
    this.adminRegister = { name: '', email: '', password: '', passwordConfirm: '' };
    this.loginError.set('');
    this.registerError.set('');
    this.isLoading.set(false);
  }

  // Social Login Methods
  async loginWithGoogle() {
    this.isLoading.set(true);
    try {
      // TODO: Implementar Google OAuth
      console.log('Login with Google');
      
      // Simulación de login exitoso
      setTimeout(() => {
        this.isLoading.set(false);
        this.closeModal();
        // TODO: Guardar token de usuario y redirigir
        alert('¡Bienvenido! Login con Google exitoso (demo)');
      }, 2000);
      
    } catch (error) {
      this.isLoading.set(false);
      console.error('Error logging in with Google:', error);
    }
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
        // TODO: Guardar token de usuario y redirigir
        alert('¡Bienvenido! Login con Facebook exitoso (demo)');
      }, 2000);
      
    } catch (error) {
      this.isLoading.set(false);
      console.error('Error logging in with Facebook:', error);
    }
  }

  // Admin Login Methods
  async loginAdmin() {
    if (!this.adminCredentials.email || !this.adminCredentials.password) {
      this.loginError.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.loginError.set('');

    try {
      // TODO: Implementar llamada a API de login admin
      console.log('Admin login:', this.adminCredentials);
      
      // Simulación de login
      setTimeout(() => {
        if (this.adminCredentials.email === 'admin@adoptacat.org' && this.adminCredentials.password === 'admin123') {
          this.isLoading.set(false);
          this.closeModal();
          // TODO: Guardar token de admin y redirigir al panel de admin
          alert('¡Bienvenido Admin! Acceso concedido (demo)');
        } else {
          this.isLoading.set(false);
          this.loginError.set('Credenciales incorrectas');
        }
      }, 2000);
      
    } catch (error) {
      this.isLoading.set(false);
      this.loginError.set('Error al iniciar sesión. Intenta de nuevo.');
      console.error('Error logging in admin:', error);
    }
  }

  async registerAdmin() {
    // Validaciones
    if (this.adminRegister.password !== this.adminRegister.passwordConfirm) {
      this.registerError.set('Las contraseñas no coinciden');
      return;
    }

    if (this.adminRegister.password.length < 6) {
      this.registerError.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.isLoading.set(true);
    this.registerError.set('');

    try {
      // TODO: Implementar llamada a API de registro admin
      console.log('Admin register:', this.adminRegister);
      
      // Simulación de registro exitoso
      setTimeout(() => {
        this.isLoading.set(false);
        this.showAdminRegistration.set(false);
        alert('¡Cuenta de administrador creada exitosamente! (demo)');
        // Volver al login
        this.setLoginMode('admin');
      }, 2000);
      
    } catch (error) {
      this.isLoading.set(false);
      this.registerError.set('Error al crear la cuenta. Intenta de nuevo.');
      console.error('Error registering admin:', error);
    }
  }
}