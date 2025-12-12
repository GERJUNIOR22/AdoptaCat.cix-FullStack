import { Component, EventEmitter, Input, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

interface UserFormData {
    id?: number;
    email: string;
    fullName: string;
    phone?: string;
    role: 'USER' | 'ADMIN';
    passwordHash?: string;
    isActive: boolean;
    emailVerified: boolean;
}

@Component({
    selector: 'app-user-form-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div *ngIf="isOpen()" class="fixed inset-0 z-50 overflow-y-auto" (click)="onBackdropClick($event)">
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="bg-white border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
              </h3>
              <button type="button" (click)="close()" class="text-gray-400 hover:text-gray-500">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="p-6">
            <div class="space-y-6">
              <!-- Información Básica -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label for="email" class="block text-sm font-medium text-gray-700">Email *</label>
                  <input type="email" id="email" [(ngModel)]="formData.email" name="email" required
                         [disabled]="isEditMode"
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed">
                  <p *ngIf="isEditMode" class="mt-1 text-xs text-gray-500">El email no se puede modificar</p>
                </div>

                <div class="sm:col-span-2">
                  <label for="fullName" class="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                  <input type="text" id="fullName" [(ngModel)]="formData.fullName" name="fullName" required
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input type="tel" id="phone" [(ngModel)]="formData.phone" name="phone"
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                </div>

                <div>
                  <label for="role" class="block text-sm font-medium text-gray-700">Rol *</label>
                  <select id="role" [(ngModel)]="formData.role" name="role" required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div *ngIf="!isEditMode" class="sm:col-span-2">
                  <label for="password" class="block text-sm font-medium text-gray-700">Contraseña Temporal *</label>
                  <input type="password" id="password" [(ngModel)]="tempPassword" name="password" 
                         [required]="!isEditMode"
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                  <p class="mt-1 text-xs text-gray-500">El usuario deberá cambiar esta contraseña en su primer inicio de sesión</p>
                </div>
              </div>

              <!-- Estado -->
              <div class="border-t border-gray-200 pt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-4">Estado</h4>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input type="checkbox" id="isActive" [(ngModel)]="formData.isActive" name="isActive"
                           class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                    <label for="isActive" class="ml-2 block text-sm text-gray-700">Usuario Activo</label>
                  </div>

                  <div class="flex items-center">
                    <input type="checkbox" id="emailVerified" [(ngModel)]="formData.emailVerified" name="emailVerified"
                           class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                    <label for="emailVerified" class="ml-2 block text-sm text-gray-700">Email Verificado</label>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div *ngIf="errorMessage()" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-red-800">{{ errorMessage() }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" (click)="close()"
                      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" [disabled]="saving()"
                      class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <span *ngIf="!saving()">{{ isEditMode ? 'Actualizar' : 'Crear' }}</span>
                <span *ngIf="saving()">Guardando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: contents;
    }
  `]
})
export class UserFormModalComponent implements OnInit {
    @Input() user: any = null;
    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    isOpen = signal(false);
    saving = signal(false);
    errorMessage = signal('');
    isEditMode = false;
    tempPassword = '';

    formData: UserFormData = {
        email: '',
        fullName: '',
        phone: '',
        role: 'USER',
        isActive: true,
        emailVerified: false
    };

    constructor(private adminService: AdminService) { }

    ngOnInit() {
        if (this.user) {
            this.isEditMode = true;
            this.formData = { ...this.user };
        }
    }

    open() {
        this.isOpen.set(true);
        this.errorMessage.set('');
    }

    close() {
        this.isOpen.set(false);
        this.closed.emit();
    }

    onBackdropClick(event: Event) {
        if (event.target === event.currentTarget) {
            this.close();
        }
    }

    async onSubmit() {
        this.saving.set(true);
        this.errorMessage.set('');

        try {
            const userData: any = { ...this.formData };

            // Add password for new users
            if (!this.isEditMode && this.tempPassword) {
                userData.passwordHash = this.tempPassword;
            }

            if (this.isEditMode) {
                await this.adminService.updateUser(this.formData.id!, userData).toPromise();
            } else {
                await this.adminService.createUser(userData).toPromise();
            }

            this.saved.emit();
            this.close();
        } catch (error: any) {
            console.error('Error saving user:', error);
            this.errorMessage.set(error.error?.message || 'Error al guardar el usuario. Por favor intenta de nuevo.');
        } finally {
            this.saving.set(false);
        }
    }
}
