import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
      <div class="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
        @if (isLoading) {
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Completando inicio de sesión...</h2>
            <p class="text-gray-600">Procesando información de Google</p>
          </div>
        } @else if (hasError) {
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-red-800 mb-2">Error al iniciar sesión</h2>
            <p class="text-red-600 mb-4">{{ errorMessage }}</p>
            <button (click)="goHome()" 
                    class="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg transition-colors">
              Volver al inicio
            </button>
          </div>
        } @else {
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-green-800 mb-2">¡Bienvenido!</h2>
            <p class="text-gray-600 mb-2">Has iniciado sesión exitosamente con Google</p>
            @if (userName) {
              <p class="text-lg font-medium text-gray-800 mb-4">Hola, {{ userName }}!</p>
            }
            <p class="text-sm text-gray-500 mb-4">Redirigiendo en {{ countdown }} segundos...</p>
            <button (click)="goHome()" 
                    class="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg transition-colors">
              Continuar ahora
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class LoginSuccessComponent implements OnInit {
  isLoading = true;
  hasError = false;
  errorMessage = '';
  userName = '';
  countdown = 3;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  private readonly titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle('AdoptaCat - Iniciando Sesión');
    
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Error al autenticar con Google. Verifica la configuración OAuth2.';
      } else if (params['name'] && params['email']) {
        const name = params['name'];
        const email = params['email'];
        this.userName = name;
        
        // Guardar usuario autenticado
        this.authService.login({ name, email });
        this.isLoading = false;
        
        // Iniciar countdown y redirección automática
        const interval = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) {
            clearInterval(interval);
            this.goHome();
          }
        }, 1000);
        
      } else {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'No se recibieron los datos de usuario de Google. Intenta iniciar sesión nuevamente.';
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}