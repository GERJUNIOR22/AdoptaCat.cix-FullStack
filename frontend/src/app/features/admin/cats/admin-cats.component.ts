import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Cat, PageResponse } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-cats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Gatos</h1>
          <p class="mt-2 text-sm text-gray-700">Administra todos los gatos en el sistema</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button type="button" 
                  class="inline-flex items-center justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">
            <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Agregar Gato
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Filtros</h3>
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
                <option value="AVAILABLE">Disponible</option>
                <option value="PENDING">Pendiente</option>
                <option value="ADOPTED">Adoptado</option>
                <option value="UNAVAILABLE">No disponible</option>
              </select>
            </div>
            
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700">Buscar</label>
              <input type="text" 
                     id="search"
                     [(ngModel)]="filters.search"
                     (ngModelChange)="onFilterChange()"
                     placeholder="Nombre, raza..."
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div class="sm:col-span-2 flex items-end space-x-3">
              <button type="button" 
                      (click)="resetFilters()"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                Limpiar filtros
              </button>
              
              <button type="button" 
                      [disabled]="selectedCats.length === 0"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                Acciones en lote ({{ selectedCats.length }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>

      <!-- Cats Table -->
      <div *ngIf="!loading()" class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h3 class="text-base font-semibold text-gray-900">
            Gatos ({{ catsResponse()?.totalElements || 0 }})
          </h3>
          <div class="mt-3 sm:mt-0">
            <label for="page-size" class="sr-only">Elementos por página</label>
            <select id="page-size"
                    [(ngModel)]="pageSize"
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
                  Gato
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Información
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let cat of catsResponse()?.content || []; trackBy: trackByCatId" 
                  [class.bg-gray-50]="selectedCats.includes(cat.id)">
                <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input type="checkbox" 
                         [checked]="selectedCats.includes(cat.id)"
                         (change)="toggleCatSelection(cat.id, $event)"
                         class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ cat.name }}</div>
                      <div class="text-sm text-gray-500">ID: {{ cat.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ cat.breed }}</div>
                  <div class="text-sm text-gray-500">
                    {{ cat.age }} • {{ cat.gender }} • {{ cat.size }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusBadgeClass(cat.adoptionStatus)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getStatusText(cat.adoptionStatus) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(cat.arrivalDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button type="button" 
                            class="text-rose-600 hover:text-rose-900">
                      Ver
                    </button>
                    <button type="button" 
                            class="text-blue-600 hover:text-blue-900">
                      Editar
                    </button>
                    <button type="button" 
                            class="text-red-600 hover:text-red-900">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div *ngIf="catsResponse()" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button [disabled]="currentPage === 0"
                      (click)="previousPage()"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
              </button>
              <button [disabled]="currentPage >= (catsResponse()?.totalPages || 1) - 1"
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
                  <span class="font-medium">{{ Math.min((currentPage + 1) * pageSize, catsResponse()?.totalElements || 0) }}</span>
                  de
                  <span class="font-medium">{{ catsResponse()?.totalElements || 0 }}</span>
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
                  <button [disabled]="currentPage >= (catsResponse()?.totalPages || 1) - 1"
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
export class AdminCatsComponent implements OnInit {
  catsResponse = signal<PageResponse<Cat> | null>(null);
  loading = signal(true);
  selectedCats: string[] = [];
  currentPage = 0;
  pageSize = 10;

  filters = {
    status: '',
    search: ''
  };

  Math = Math;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadCats();
  }

  loadCats() {
    this.loading.set(true);
    
    this.adminService.getCats(
      this.currentPage, 
      this.pageSize, 
      'name', 
      'asc', 
      this.filters.status || undefined
    ).subscribe({
      next: (response) => {
        this.catsResponse.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading cats:', err);
        this.loading.set(false);
      }
    });
  }

  onFilterChange() {
    this.currentPage = 0;
    this.loadCats();
  }

  onPageSizeChange() {
    this.currentPage = 0;
    this.loadCats();
  }

  resetFilters() {
    this.filters = {
      status: '',
      search: ''
    };
    this.currentPage = 0;
    this.loadCats();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCats();
    }
  }

  nextPage() {
    const response = this.catsResponse();
    if (response && this.currentPage < response.totalPages - 1) {
      this.currentPage++;
      this.loadCats();
    }
  }

  toggleCatSelection(catId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCats.push(catId);
    } else {
      this.selectedCats = this.selectedCats.filter(id => id !== catId);
    }
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const cats = this.catsResponse()?.content || [];
    
    if (isChecked) {
      this.selectedCats = cats.map(cat => cat.id);
    } else {
      this.selectedCats = [];
    }
  }

  allSelected(): boolean {
    const cats = this.catsResponse()?.content || [];
    return cats.length > 0 && cats.every(cat => this.selectedCats.includes(cat.id));
  }

  someSelected(): boolean {
    return this.selectedCats.length > 0 && !this.allSelected();
  }

  trackByCatId(index: number, cat: Cat): string {
    return cat.id;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADOPTED':
        return 'bg-blue-100 text-blue-800';
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'PENDING':
        return 'Pendiente';
      case 'ADOPTED':
        return 'Adoptado';
      case 'UNAVAILABLE':
        return 'No disponible';
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