import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdoptionApplication, PageResponse } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Solicitudes de Adopción</h1>
          <p class="mt-2 text-sm text-gray-700">Gestiona todas las solicitudes de adopción</p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button type="button" 
                  class="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
            <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            Aprobar Seleccionadas
          </button>
          <button type="button" 
                  class="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
            <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
            Rechazar Seleccionadas
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Filtros de Búsqueda</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label for="status-filter" class="block text-sm font-medium text-gray-700">Estado</label>
              <select id="status-filter" 
                      [(ngModel)]="filters.status"
                      (ngModelChange)="onFilterChange()"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendiente</option>
                <option value="APPROVED">Aprobada</option>
                <option value="REJECTED">Rechazada</option>
                <option value="COMPLETED">Completada</option>
              </select>
            </div>
            
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700">Buscar Adoptante</label>
              <input type="text" 
                     id="search"
                     [(ngModel)]="filters.search"
                     (ngModelChange)="onFilterChange()"
                     placeholder="Nombre del adoptante..."
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="date-from" class="block text-sm font-medium text-gray-700">Fecha desde</label>
              <input type="date" 
                     id="date-from"
                     [(ngModel)]="filters.dateFrom"
                     (ngModelChange)="onFilterChange()"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="date-to" class="block text-sm font-medium text-gray-700">Fecha hasta</label>
              <input type="date" 
                     id="date-to"
                     [(ngModel)]="filters.dateTo"
                     (ngModelChange)="onFilterChange()"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>
          </div>
          
          <div class="mt-4 flex space-x-3">
            <button type="button" 
                    (click)="resetFilters()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Limpiar filtros
            </button>
            
            <button type="button" 
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Exportar a Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats().pending }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Aprobadas</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats().approved }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Completadas</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats().completed }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Rechazadas</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats().rejected }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>

      <!-- Applications Table -->
      <div *ngIf="!loading()" class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h3 class="text-base font-semibold text-gray-900">
            Solicitudes ({{ applicationsResponse()?.totalElements || 0 }})
          </h3>
          <div class="mt-3 sm:mt-0">
            <select [(ngModel)]="pageSize"
                    (ngModelChange)="onPageSizeChange()"
                    class="block w-full rounded-md border-gray-300 text-sm focus:border-rose-500 focus:ring-rose-500">
              <option value="10">10 por página</option>
              <option value="25">25 por página</option>
              <option value="50">50 por página</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input type="checkbox" 
                         [checked]="allSelected()"
                         [indeterminate]="someSelected()"
                         (change)="toggleSelectAll($event)"
                         class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600">
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adoptante
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gato
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntuación
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let app of applicationsResponse()?.content || []; trackBy: trackByAppId" 
                  [class.bg-gray-50]="selectedApplications.includes(app.id)">
                <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input type="checkbox" 
                         [checked]="selectedApplications.includes(app.id)"
                         (change)="toggleApplicationSelection(app.id, $event)"
                         class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ getInitials(app.fullName) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ app.fullName }}</div>
                      <div class="text-sm text-gray-500">{{ app.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ app.cat.name }}</div>
                  <div class="text-sm text-gray-500">ID: {{ app.cat.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusBadgeClass(app.status)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getStatusText(app.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(app.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">-</div>
                    <div class="ml-2">
                      <div class="text-sm text-gray-500">Sin puntuación</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button type="button" 
                            class="text-rose-600 hover:text-rose-900">
                      Ver Detalles
                    </button>
                    <button *ngIf="app.status === 'PENDING'" 
                            type="button" 
                            class="text-green-600 hover:text-green-900">
                      Aprobar
                    </button>
                    <button *ngIf="app.status === 'PENDING'" 
                            type="button" 
                            class="text-red-600 hover:text-red-900">
                      Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div *ngIf="applicationsResponse()" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button [disabled]="currentPage === 0"
                      (click)="previousPage()"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
              </button>
              <button [disabled]="currentPage >= (applicationsResponse()?.totalPages || 1) - 1"
                      (click)="nextPage()"
                      class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Siguiente
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando
                  <span class="font-medium">{{ (currentPage * pageSize) + 1 }}</span>
                  a
                  <span class="font-medium">{{ Math.min((currentPage + 1) * pageSize, applicationsResponse()?.totalElements || 0) }}</span>
                  de
                  <span class="font-medium">{{ applicationsResponse()?.totalElements || 0 }}</span>
                  resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button [disabled]="currentPage === 0"
                          (click)="previousPage()"
                          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                  </button>
                  <button [disabled]="currentPage >= (applicationsResponse()?.totalPages || 1) - 1"
                          (click)="nextPage()"
                          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Siguiente
                  </button>
                </nav>
              </div>
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
export class AdminApplicationsComponent implements OnInit {
  applicationsResponse = signal<PageResponse<AdoptionApplication> | null>(null);
  loading = signal(true);
  selectedApplications: number[] = [];
  currentPage = 0;
  pageSize = 10;

  filters = {
    status: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  };

  stats = signal({
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  });

  Math = Math;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadApplications();
    this.loadStats();
  }

  loadApplications() {
    this.loading.set(true);
    
    this.adminService.getApplications(
      this.currentPage, 
      this.pageSize, 
      'createdAt', 
      'desc'
    ).subscribe({
      next: (response) => {
        this.applicationsResponse.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.loading.set(false);
      }
    });
  }

  loadStats() {
    // En una implementación real, esto vendría del AdminService
    this.stats.set({
      pending: 25,
      approved: 18,
      rejected: 7,
      completed: 12
    });
  }

  onFilterChange() {
    this.currentPage = 0;
    this.loadApplications();
  }

  onPageSizeChange() {
    this.currentPage = 0;
    this.loadApplications();
  }

  resetFilters() {
    this.filters = {
      status: '',
      search: '',
      dateFrom: '',
      dateTo: ''
    };
    this.currentPage = 0;
    this.loadApplications();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadApplications();
    }
  }

  nextPage() {
    const response = this.applicationsResponse();
    if (response && this.currentPage < response.totalPages - 1) {
      this.currentPage++;
      this.loadApplications();
    }
  }

  toggleApplicationSelection(appId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedApplications.push(appId);
    } else {
      this.selectedApplications = this.selectedApplications.filter(id => id !== appId);
    }
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const apps = this.applicationsResponse()?.content || [];
    
    if (isChecked) {
      this.selectedApplications = apps.map(app => app.id);
    } else {
      this.selectedApplications = [];
    }
  }

  allSelected(): boolean {
    const apps = this.applicationsResponse()?.content || [];
    return apps.length > 0 && apps.every(app => this.selectedApplications.includes(app.id));
  }

  someSelected(): boolean {
    return this.selectedApplications.length > 0 && !this.allSelected();
  }

  trackByAppId(index: number, app: AdoptionApplication): number {
    return app.id;
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'APPROVED':
        return 'Aprobada';
      case 'REJECTED':
        return 'Rechazada';
      case 'COMPLETED':
        return 'Completada';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }
}