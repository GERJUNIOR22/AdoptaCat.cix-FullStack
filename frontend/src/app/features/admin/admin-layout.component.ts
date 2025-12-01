import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0"
           [class.translate-x-0]="sidebarOpen()"
           [class.-translate-x-full]="!sidebarOpen()">
        
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 px-4 bg-rose-600">
          <h1 class="text-xl font-bold text-white">AdoptaCat Admin</h1>
        </div>

        <!-- Navigation -->
        <nav class="mt-8">
          <div class="px-4">
            <ul class="space-y-2">
              <li>
                <a [routerLink]="['/admin/dashboard']" 
                   routerLinkActive="bg-rose-50 text-rose-700 border-r-4 border-rose-600"
                   class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"></path>
                  </svg>
                  Dashboard
                </a>
              </li>
              
              <li>
                <a [routerLink]="['/admin/cats']" 
                   routerLinkActive="bg-rose-50 text-rose-700 border-r-4 border-rose-600"
                   class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                  Gestión de Gatos
                </a>
              </li>
              
              <li>
                <a [routerLink]="['/admin/applications']" 
                   routerLinkActive="bg-rose-50 text-rose-700 border-r-4 border-rose-600"
                   class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Solicitudes de Adopción
                </a>
              </li>
              
              <li>
                <a [routerLink]="['/admin/users']" 
                   routerLinkActive="bg-rose-50 text-rose-700 border-r-4 border-rose-600"
                   class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  Gestión de Usuarios
                </a>
              </li>
              
              <li>
                <a [routerLink]="['/admin/reports']" 
                   routerLinkActive="bg-rose-50 text-rose-700 border-r-4 border-rose-600"
                   class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Reportes
                </a>
              </li>
              
              <li>
                <a [routerLink]="['/admin/settings']" 
                   routerLinkActive="bg-rose-50 text-rose-700 border-r-4 border-rose-600"
                   class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Configuración
                </a>
              </li>

              <li>
                <a [routerLink]="['/admin/blog']" 
                   routerLinkActive="bg-rose-50 text-rose-700 border-r-4 border-rose-600"
                   class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                  </svg>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <!-- Logout Button -->
          <div class="absolute bottom-0 w-full p-4">
            <button (click)="logout()" 
                    class="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="lg:pl-64">
        <!-- Top Bar -->
        <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <!-- Mobile menu button -->
          <button type="button" 
                  (click)="toggleSidebar()"
                  class="-m-2.5 p-2.5 text-gray-700 lg:hidden">
            <span class="sr-only">Abrir sidebar</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <!-- Page title -->
          <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">{{ getPageTitle() }}</h1>
            </div>
            
            <!-- User info -->
            <div class="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"></div>
              
              <!-- User menu -->
              <div class="flex items-center gap-x-2">
                <div class="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {{ getUserInitials() }}
                </div>
                <div class="hidden lg:block">
                  <p class="text-sm font-medium text-gray-900">{{ user()?.name }}</p>
                  <p class="text-xs text-gray-500">{{ user()?.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Page Content -->
        <main class="py-6">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>

    <!-- Mobile sidebar overlay -->
    <div *ngIf="sidebarOpen()" 
         class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
         (click)="closeSidebar()"></div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminLayoutComponent {
  sidebarOpen = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  get user() {
    return this.authService.user;
  }

  toggleSidebar() {
    this.sidebarOpen.update(current => !current);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  getUserInitials(): string {
    const name = this.user()?.name;
    if (!name) return '';
    return name.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/cats')) return 'Gestión de Gatos';
    if (url.includes('/applications')) return 'Solicitudes de Adopción';
    if (url.includes('/users')) return 'Gestión de Usuarios';
    if (url.includes('/reports')) return 'Reportes';
    if (url.includes('/settings')) return 'Configuración';
    if (url.includes('/blog')) return 'Gestión del Blog';
    return 'Administración';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}