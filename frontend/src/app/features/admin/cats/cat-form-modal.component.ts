import { Component, EventEmitter, Input, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface CatFormData {
    id?: string;
    name: string;
    breed: string;
    gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
    edadMeses: number;
    size: 'SMALL' | 'MEDIUM' | 'LARGE';
    isVaccinated: boolean;
    isSterilized: boolean;
    description: string;
    adoptionStatus: 'AVAILABLE' | 'PENDING' | 'ADOPTED' | 'UNAVAILABLE';
    age: number;
    birthDate?: string;
    mainImageUrl?: string;
    story?: string;
    personality?: string;
    healthStatus: 'HEALTHY' | 'SICK' | 'IN_TREATMENT' | 'CHRONIC_CONDITION' | 'UNKNOWN';
    isSpecialNeeds: boolean;
    activityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
    featured: boolean;
    arrivedAt?: string;
}

@Component({
    selector: 'app-cat-form-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div *ngIf="isOpen()" class="fixed inset-0 z-50 overflow-y-auto" (click)="onBackdropClick($event)">
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ isEditMode ? 'Editar Gato' : 'Agregar Nuevo Gato' }}
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
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-4">Información Básica</h4>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Nombre *</label>
                    <input type="text" id="name" [(ngModel)]="formData.name" name="name" required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                  </div>

                  <div>
                    <label for="breed" class="block text-sm font-medium text-gray-700">Raza</label>
                    <input type="text" id="breed" [(ngModel)]="formData.breed" name="breed"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                  </div>

                  <div>
                    <label for="gender" class="block text-sm font-medium text-gray-700">Género *</label>
                    <select id="gender" [(ngModel)]="formData.gender" name="gender" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                      <option value="MALE">Macho</option>
                      <option value="FEMALE">Hembra</option>
                      <option value="UNKNOWN">Desconocido</option>
                    </select>
                  </div>

                  <div>
                    <label for="edadMeses" class="block text-sm font-medium text-gray-700">Edad (meses)</label>
                    <input type="number" id="edadMeses" [(ngModel)]="formData.edadMeses" name="edadMeses" min="0"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                  </div>

                  <div>
                    <label for="size" class="block text-sm font-medium text-gray-700">Tamaño</label>
                    <select id="size" [(ngModel)]="formData.size" name="size"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                      <option value="SMALL">Pequeño</option>
                      <option value="MEDIUM">Mediano</option>
                      <option value="LARGE">Grande</option>
                    </select>
                  </div>

                  <div>
                    <label for="adoptionStatus" class="block text-sm font-medium text-gray-700">Estado de Adopción</label>
                    <select id="adoptionStatus" [(ngModel)]="formData.adoptionStatus" name="adoptionStatus"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                      <option value="AVAILABLE">Disponible</option>
                      <option value="PENDING">Pendiente</option>
                      <option value="ADOPTED">Adoptado</option>
                      <option value="UNAVAILABLE">No disponible</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Salud -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-4">Salud</h4>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label for="healthStatus" class="block text-sm font-medium text-gray-700">Estado de Salud</label>
                    <select id="healthStatus" [(ngModel)]="formData.healthStatus" name="healthStatus"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                      <option value="HEALTHY">Saludable</option>
                      <option value="SICK">Enfermo</option>
                      <option value="IN_TREATMENT">En tratamiento</option>
                      <option value="CHRONIC_CONDITION">Condición crónica</option>
                      <option value="UNKNOWN">Desconocido</option>
                    </select>
                  </div>

                  <div>
                    <label for="activityLevel" class="block text-sm font-medium text-gray-700">Nivel de Actividad</label>
                    <select id="activityLevel" [(ngModel)]="formData.activityLevel" name="activityLevel"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                      <option value="LOW">Bajo</option>
                      <option value="MEDIUM">Medio</option>
                      <option value="HIGH">Alto</option>
                      <option value="VERY_HIGH">Muy Alto</option>
                    </select>
                  </div>

                  <div class="flex items-center">
                    <input type="checkbox" id="isVaccinated" [(ngModel)]="formData.isVaccinated" name="isVaccinated"
                           class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                    <label for="isVaccinated" class="ml-2 block text-sm text-gray-700">Vacunado</label>
                  </div>

                  <div class="flex items-center">
                    <input type="checkbox" id="isSterilized" [(ngModel)]="formData.isSterilized" name="isSterilized"
                           class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                    <label for="isSterilized" class="ml-2 block text-sm text-gray-700">Esterilizado</label>
                  </div>

                  <div class="flex items-center">
                    <input type="checkbox" id="isSpecialNeeds" [(ngModel)]="formData.isSpecialNeeds" name="isSpecialNeeds"
                           class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                    <label for="isSpecialNeeds" class="ml-2 block text-sm text-gray-700">Necesidades Especiales</label>
                  </div>

                  <div class="flex items-center">
                    <input type="checkbox" id="featured" [(ngModel)]="formData.featured" name="featured"
                           class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                    <label for="featured" class="ml-2 block text-sm text-gray-700">Destacado</label>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-4">Descripción</h4>
                <div class="space-y-4">
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea id="description" [(ngModel)]="formData.description" name="description" rows="3"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"></textarea>
                  </div>

                  <div>
                    <label for="personality" class="block text-sm font-medium text-gray-700">Personalidad</label>
                    <textarea id="personality" [(ngModel)]="formData.personality" name="personality" rows="2"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"></textarea>
                  </div>

                  <div>
                    <label for="story" class="block text-sm font-medium text-gray-700">Historia</label>
                    <textarea id="story" [(ngModel)]="formData.story" name="story" rows="3"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"></textarea>
                  </div>

                  <div>
                    <label for="mainImageUrl" class="block text-sm font-medium text-gray-700">URL de Imagen Principal</label>
                    <input type="url" id="mainImageUrl" [(ngModel)]="formData.mainImageUrl" name="mainImageUrl"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
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
export class CatFormModalComponent implements OnInit {
    @Input() cat: any = null;
    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    isOpen = signal(false);
    saving = signal(false);
    errorMessage = signal('');
    isEditMode = false;

    formData: CatFormData = {
        name: '',
        breed: '',
        gender: 'UNKNOWN',
        edadMeses: 0,
        size: 'MEDIUM',
        isVaccinated: false,
        isSterilized: false,
        description: '',
        adoptionStatus: 'AVAILABLE',
        age: 0,
        healthStatus: 'HEALTHY',
        isSpecialNeeds: false,
        activityLevel: 'MEDIUM',
        featured: false
    };

    constructor(private http: HttpClient) { }

    ngOnInit() {
        if (this.cat) {
            this.isEditMode = true;
            this.formData = { ...this.cat };
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
            // Generate ID for new cats
            if (!this.isEditMode && !this.formData.id) {
                this.formData.id = this.generateCatId();
            }

            // Set arrivedAt if not set
            if (!this.formData.arrivedAt) {
                this.formData.arrivedAt = new Date().toISOString().split('T')[0];
            }

            const url = this.isEditMode
                ? `${environment.apiUrl}/cats/${this.formData.id}`
                : `${environment.apiUrl}/cats`;

            const method = this.isEditMode ? 'put' : 'post';

            await this.http[method](url, this.formData).toPromise();

            this.saved.emit();
            this.close();
        } catch (error: any) {
            console.error('Error saving cat:', error);
            this.errorMessage.set(error.error?.message || 'Error al guardar el gato. Por favor intenta de nuevo.');
        } finally {
            this.saving.set(false);
        }
    }

    private generateCatId(): string {
        return 'CAT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}
