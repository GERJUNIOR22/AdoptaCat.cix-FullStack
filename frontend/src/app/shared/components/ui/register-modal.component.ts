import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isVisible()) {
      <div *ngIf="isVisible()" class="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm"
           (click)="closeModal()">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4"
             (click)="$event.stopPropagation()">

          <!-- Cabecera -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-900 font-sans">Crear cuenta</h2>
              <button (click)="closeModal()"
                      class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-4 text-center font-reading">
              Regístrate para poder adoptar y seguir a tus gatitos favoritos
            </p>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            <form #registerForm="ngForm" (ngSubmit)="onSubmit(registerForm)">
              <div class="space-y-4">

                <!-- Nombre completo del usuario -->
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    [(ngModel)]="form.fullName"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tu nombre completo">
                </div>

                <!-- Email -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    [(ngModel)]="form.email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                    placeholder="ejemplo@email.com">
                </div>

                <!-- Teléfono ( es opcional ) -->
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    [(ngModel)]="form.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tu número de teléfono">
                </div>

                <!-- Contraseña -->
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Contraseña
                  </label>
                  <div class="relative">
                    <input
                      [type]="showPassword() ? 'text' : 'password'"
                      id="password"
                      name="password"
                      [(ngModel)]="form.password"
                      required
                      minlength="8"
                      class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                      placeholder="Mínimo 8 caracteres">
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      (click)="togglePasswordVisibility()">
                      <svg *ngIf="!showPassword()" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                           viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                           class="text-gray-400">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <svg *ngIf="showPassword()" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                           viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                           class="text-gray-400">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68"/>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61"/>
                        <path d="M2 2 22 22"/>
                      </svg>
                    </button>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">
                    Usa una combinación de letras mayúsculas, minúsculas, números y símbolos.
                  </p>
                </div>

                <!-- Confirmar contraseña -->
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Confirmar contraseña
                  </label>
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    id="confirmPassword"
                    name="confirmPassword"
                    [(ngModel)]="form.confirmPassword"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                    placeholder="Repite tu contraseña">
                </div>

                <!-- Errores -->
                @if (registerError()) {
                  <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p class="text-red-600 text-sm">{{ registerError() }}</p>
                  </div>
                }

                <!-- Mensaje de confirmación de registro -->
                @if (registerSuccess()) {
                  <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p class="text-green-700 text-sm">{{ registerSuccess() }}</p>
                  </div>
                }

                <!-- Botón -->
                <button
                  type="submit"
                  [disabled]="!registerForm.valid || isLoading()"
                  class="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed font-sans">
                  @if (isLoading()) {
                    <div class="flex items-center justify-center gap-2">
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando cuenta...
                    </div>
                  } @else {
                    Crear cuenta
                  }
                </button>

              </div>
            </form>

            <div class="text-center mt-6">
              <p class="text-xs text-gray-500 font-reading">
                Al registrarte, aceptas nuestros
                <a href="#" class="text-rose-600 hover:underline">términos de servicio</a> y
                <a href="#" class="text-rose-600 hover:underline">política de privacidad</a>.
              </p>
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
export class RegisterModalComponent {
  isVisible = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  registerError = signal<string>('');
  registerSuccess = signal<string>('');

  // Modelo del formulario de registro
  form = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  private apiUrl = 'http://localhost:8080/api/auth/register';

  constructor(private http: HttpClient) {}

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
    this.form = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };
    this.registerError.set('');
    this.registerSuccess.set('');
    this.isLoading.set(false);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.registerError.set('Por favor completa todos los campos requeridos');
      return;
    }

    if (this.form.password.length < 8) {
      this.registerError.set('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.registerError.set('Las contraseñas no coinciden');
      return;
    }

    this.registerError.set('');
    this.registerSuccess.set('');
    this.isLoading.set(true);

    const payload = {
      email: this.form.email,
      password: this.form.password,
      fullName: this.form.fullName,
      phone: this.form.phone
    };

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.registerSuccess.set(
          res?.message || 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.'
        );
        setTimeout(() => this.closeModal(), 2500);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al registrar usuario:', err);

        if (err.status === 409) {
          this.registerError.set('El email ya está registrado.');
        } else if (err.status === 400) {
          this.registerError.set(
            err.error?.message || 'Datos inválidos. Verifica la información ingresada.'
          );
        } else {
          this.registerError.set('Ocurrió un error al registrar. Inténtalo nuevamente.');
        }
      }
    });
  }
}

// Texto para realizar un push en la rama develop (IGNORAR)