import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, User, PageResponse } from '../../../core/services/admin.service';
import { UserFormModalComponent } from './user-form-modal.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p class="mt-2 text-sm text-gray-700">Administra todos los usuarios del sistema</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button type="button" 
                  (click)="openCreateModal()"
                  class="inline-flex items-center justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500">
            <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Crear Usuario
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
              <label for="role-filter" class="block text-sm font-medium text-gray-700">Rol</label>
              <select id="role-filter" 
                      [(ngModel)]="filters.role"
                      (ngModelChange)="onFilterChange()"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                <option value="">Todos los roles</option>
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            
            <div>
              <label for="status-filter" class="block text-sm font-medium text-gray-700">Estado</label>
              <select id="status-filter" 
                      [(ngModel)]="filters.status"
                      (ngModelChange)="onFilterChange()"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="verified">Verificado</option>
                <option value="unverified">No verificado</option>
              </select>
            </div>

            <div>
              <label for="search" class="block text-sm font-medium text-gray-700">Buscar</label>
              <input type="text" 
                     id="search"
                     [(ngModel)]="filters.search"
                     (ngModelChange)="onFilterChange()"
                     placeholder="Nombre, email..."
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div class="flex items-end">
              <button type="button" 
                      (click)="resetFilters()"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- User Stats -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats().total }}</dd>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Activos</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats().active }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Verificados</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats().verified }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Administradores</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats().admins }}</dd>
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

      <!-- Users Table -->
      <div *ngIf="!loading()" class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h3 class="text-base font-semibold text-gray-900">
            Usuarios ({{ usersResponse()?.totalElements || 0 }})
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
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha registro
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última actualización
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let user of usersResponse()?.content || []; trackBy: trackByUserId">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <div *ngIf="user.profileImageUrl; else defaultAvatar" 
                           class="h-10 w-10 rounded-full">
                        <img [src]="user.profileImageUrl" 
                             [alt]="user.fullName"
                             class="h-10 w-10 rounded-full object-cover">
                      </div>
                      <ng-template #defaultAvatar>
                        <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span class="text-sm font-medium text-gray-700">
                            {{ getInitials(user.fullName) }}
                          </span>
                        </div>
                      </ng-template>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                      <div *ngIf="user.phone" class="text-sm text-gray-500">{{ user.phone }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getRoleBadgeClass(user.role)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getRoleText(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col space-y-1">
                    <span [class]="getStatusBadgeClass(user.isActive)" 
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ user.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                    <span [class]="getVerificationBadgeClass(user.emailVerified)" 
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ user.emailVerified ? 'Verificado' : 'Sin verificar' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.updatedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button type="button" 
                            (click)="openEditModal(user)"
                            class="text-blue-600 hover:text-blue-900">
                      Editar
                    </button>
                    <button *ngIf="user.isActive" 
                            type="button" 
                            (click)="toggleUserStatus(user)"
                            class="text-yellow-600 hover:text-yellow-900">
                      Desactivar
                    </button>
                    <button *ngIf="!user.isActive" 
                            type="button" 
                            (click)="toggleUserStatus(user)"
                            class="text-green-600 hover:text-green-900">
                      Activar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div *ngIf="usersResponse()" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button [disabled]="currentPage === 0"
                      (click)="previousPage()"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
              </button>
              <button [disabled]="currentPage >= (usersResponse()?.totalPages || 1) - 1"
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
                  <span class="font-medium">{{ Math.min((currentPage + 1) * pageSize, usersResponse()?.totalElements || 0) }}</span>
                  de
                  <span class="font-medium">{{ usersResponse()?.totalElements || 0 }}</span>
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
                  <button [disabled]="currentPage >= (usersResponse()?.totalPages || 1) - 1"
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

      <!-- User Form Modal -->
      <app-user-form-modal #userModal
                           [user]="selectedUser"
                           (saved)="onUserSaved()"
                           (closed)="onModalClosed()">
      </app-user-form-modal>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  @ViewChild('userModal') userModal!: UserFormModalComponent;

  usersResponse = signal<PageResponse<User> | null>(null);
  loading = signal(true);
  selectedUser: User | null = null;
  currentPage = 0;
  pageSize = 10;

  filters = {
    role: '',
    status: '',
    search: ''
  };

  stats = signal({
    total: 0,
    active: 0,
    verified: 0,
    admins: 0
  });

  Math = Math;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadUsers();
    this.loadStats();
  }

  loadUsers() {
    this.loading.set(true);

    this.adminService.getUsers(
      this.currentPage,
      this.pageSize,
      'createdAt',
      'desc'
    ).subscribe({
      next: (response) => {
        this.usersResponse.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading.set(false);
      }
    });
  }

  loadStats() {
    // En una implementación real, esto vendría del AdminService
    this.stats.set({
      total: 156,
      active: 142,
      verified: 128,
      admins: 5
    });
  }

  openCreateModal() {
    this.selectedUser = null;
    setTimeout(() => {
      this.userModal.open();
    });
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    setTimeout(() => {
      this.userModal.open();
    });
  }

  toggleUserStatus(user: User) {
    const action = user.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que deseas ${action} a ${user.fullName}?`)) {
      this.adminService.toggleUserStatus(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error toggling user status:', err);
          alert('Error al cambiar el estado del usuario. Por favor intenta de nuevo.');
        }
      });
    }
  }

  onUserSaved() {
    this.loadUsers();
  }

  onModalClosed() {
    this.selectedUser = null;
  }

  onFilterChange() {
    this.currentPage = 0;
    this.loadUsers();
  }

  onPageSizeChange() {
    this.currentPage = 0;
    this.loadUsers();
  }

  resetFilters() {
    this.filters = {
      role: '',
      status: '',
      search: ''
    };
    this.currentPage = 0;
    this.loadUsers();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage() {
    const response = this.usersResponse();
    if (response && this.currentPage < response.totalPages - 1) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'USER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleText(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'USER':
        return 'Usuario';
      default:
        return role;
    }
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getVerificationBadgeClass(isVerified: boolean): string {
    return isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }
}