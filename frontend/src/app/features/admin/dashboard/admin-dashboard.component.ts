import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, DashboardStats } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard de Administración
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Resumen general del sistema AdoptaCat
          </p>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
          <button (click)="refreshData()"
                  class="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error()" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <p class="text-sm text-red-800">
              Error al cargar los datos: {{ error() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div *ngIf="stats() && !loading()" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Gatos -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Gatos</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats()?.totalCats || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-3">
            <div class="text-sm">
              <span class="text-green-600 font-medium">{{ stats()?.availableCats || 0 }}</span>
              <span class="text-gray-500"> disponibles</span>
              <span class="mx-2">•</span>
              <span class="text-blue-600 font-medium">{{ stats()?.adoptedCats || 0 }}</span>
              <span class="text-gray-500"> adoptados</span>
            </div>
          </div>
        </div>

        <!-- Solicitudes -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Solicitudes</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats()?.totalApplications || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-3">
            <div class="text-sm">
              <span class="text-yellow-600 font-medium">{{ stats()?.pendingApplications || 0 }}</span>
              <span class="text-gray-500"> pendientes</span>
              <span class="mx-2">•</span>
              <span class="text-green-600 font-medium">{{ stats()?.approvedApplications || 0 }}</span>
              <span class="text-gray-500"> aprobadas</span>
            </div>
          </div>
        </div>

        <!-- Usuarios -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Usuarios</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats()?.totalUsers || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-3">
            <div class="text-sm">
              <span class="text-green-600 font-medium">{{ stats()?.activeUsers || 0 }}</span>
              <span class="text-gray-500"> activos</span>
              <span class="mx-2">•</span>
              <span class="text-purple-600 font-medium">{{ stats()?.adminUsers || 0 }}</span>
              <span class="text-gray-500"> admins</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-rose-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Acciones Rápidas</dt>
                  <dd class="text-lg font-semibold text-gray-900">4</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-3">
            <div class="text-sm text-gray-500">
              Gestión del sistema
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div *ngIf="!loading()" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Recent Activity -->
        <div class="bg-white shadow-sm rounded-lg border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            <p class="mt-1 text-sm text-gray-500">Últimas acciones en el sistema</p>
          </div>
          <div class="p-6">
            <div class="flow-root">
              <ul class="-mb-8 space-y-6">
                <li *ngFor="let activity of recentActivities" class="relative pb-8">
                  <div class="relative flex items-start space-x-3">
                    <div class="relative">
                      <div [class]="getActivityIconClass(activity.type)" class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                        <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getActivityIconPath(activity.type)"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900">{{ activity.title }}</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">{{ activity.description }}</p>
                      </div>
                      <div class="mt-2 text-sm text-gray-500">
                        <time>{{ activity.time }}</time>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white shadow-sm rounded-lg border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
            <p class="mt-1 text-sm text-gray-500">Tareas comunes de administración</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 gap-4">
              <button class="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors text-left">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">Agregar Nuevo Gato</p>
                    <p class="text-sm text-gray-500">Registrar un gato para adopción</p>
                  </div>
                </div>
              </button>

              <button class="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors text-left">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">Revisar Solicitudes</p>
                    <p class="text-sm text-gray-500">Gestionar solicitudes pendientes</p>
                  </div>
                </div>
              </button>

              <button class="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors text-left">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">Generar Reporte</p>
                    <p class="text-sm text-gray-500">Crear reportes de actividad</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  recentActivities = [
    {
      type: 'cat',
      title: 'Nuevo gato registrado',
      description: 'Luna - Doméstico Pelo Corto agregado al sistema',
      time: 'Hace 2 horas'
    },
    {
      type: 'application',
      title: 'Solicitud aprobada',
      description: 'Solicitud #2024-001 aprobada para adopción',
      time: 'Hace 4 horas'
    },
    {
      type: 'user',
      title: 'Nuevo usuario registrado',
      description: 'maria.gonzalez@email.com se unió al sistema',
      time: 'Hace 6 horas'
    }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);
    this.error.set(null);

    this.adminService.getDashboardStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('No se pudieron cargar las estadísticas');
        this.loading.set(false);
        console.error('Error loading dashboard stats:', err);
      }
    });
  }

  refreshData() {
    this.loadDashboardData();
  }

  getActivityIconClass(type: string): string {
    switch (type) {
      case 'cat':
        return 'bg-blue-500';
      case 'application':
        return 'bg-yellow-500';
      case 'user':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }

  getActivityIconPath(type: string): string {
    switch (type) {
      case 'cat':
        return 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4';
      case 'application':
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
      case 'user':
        return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
}