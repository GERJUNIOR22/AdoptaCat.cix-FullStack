import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AdoptionFormData {
  // Información del candidato
  catId: string;
  fullName: string;
  phone: string;
  birthDate: string;
  city: string;
  dni: string;
  civilStatus: string;
  occupation: string;
  address: string;
  district: string;
  email: string;
  instagram: string;
  facebook: string;
  
  // Experiencia con mascotas
  whyAdopt: string;
  hasCurrentPets: boolean;
  currentPetsDetails: string;
  hadPreviousPets: boolean;
  previousPetsDetails: string;
  petsWhereAreNow: string;
  petsSterilized: boolean;
  sterilizationReason: string;
  
  // Hogar
  hasChildren: boolean;
  childrenAges: string;
  householdSize: string;
  allAgree: boolean;
  anyAllergies: boolean;
  livingType: string;
  movingPlans: string;
  
  // Recreación y proyección
  hasSpace: boolean;
  accessAreas: string;
  sleepingPlace: string;
  hasEscapeSpaces: boolean;
  behaviorIssuesResponse: string;
  
  // Cuidados y gastos
  whoPaysExpenses: string;
  hasVetResources: boolean;
  careCommitments: string[];
  sterilizeCommitment: boolean;
  acceptsVisits: boolean;
  acceptsTerms: boolean;
}

@Component({
  selector: 'app-adoption-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-2xl">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Solicitud de Adopción</h2>
            <button (click)="closeForm()" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p class="text-gray-600 mt-2">Es obligatorio completar todos los campos de este formulario. Esta información nos ayuda a evaluar la adopción responsable.</p>
        </div>

        <div class="p-6 space-y-8">
          <!-- Información del candidato -->
          <div class="bg-gray-50 p-6 rounded-xl">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Información del candidato</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gato (ID)</label>
                <input type="text" [(ngModel)]="formData.catId" [value]="catId" readonly
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellido *</label>
                <input type="text" [(ngModel)]="formData.fullName" required
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                <input type="tel" [(ngModel)]="formData.phone"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                <input type="date" [(ngModel)]="formData.birthDate"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input type="text" [(ngModel)]="formData.city"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                <input type="text" [(ngModel)]="formData.dni"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado civil</label>
                <select [(ngModel)]="formData.civilStatus"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                  <option value="">Seleccionar</option>
                  <option value="soltero">Soltero/a</option>
                  <option value="casado">Casado/a</option>
                  <option value="divorciado">Divorciado/a</option>
                  <option value="viudo">Viudo/a</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                <input type="text" [(ngModel)]="formData.occupation"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input type="text" [(ngModel)]="formData.address" placeholder="Calle, número"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
                <input type="text" [(ngModel)]="formData.district"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                <input type="email" [(ngModel)]="formData.email" required
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input type="text" [(ngModel)]="formData.instagram"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input type="text" [(ngModel)]="formData.facebook"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
            </div>
          </div>

          <!-- Parte 1: Experiencia con mascotas -->
          <div class="bg-gray-50 p-6 rounded-xl">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Parte 1: Experiencia con mascotas</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Por qué deseas adoptar un gatito?</label>
                <textarea [(ngModel)]="formData.whyAdopt" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">¿Actualmente tienes otros animalitos?</label>
                  <div class="flex gap-4">
                    <label class="flex items-center">
                      <input type="radio" [(ngModel)]="formData.hasCurrentPets" [value]="true" name="hasCurrentPets" class="mr-2">
                      Sí
                    </label>
                    <label class="flex items-center">
                      <input type="radio" [(ngModel)]="formData.hasCurrentPets" [value]="false" name="hasCurrentPets" class="mr-2">
                      No
                    </label>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">¿Cuáles?</label>
                  <input type="text" [(ngModel)]="formData.currentPetsDetails"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Cuáles? ¿Qué pasó con ellos?</label>
                <textarea [(ngModel)]="formData.previousPetsDetails" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Anteriormente has tenido otros animalitos?</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hadPreviousPets" [value]="true" name="hadPreviousPets" class="mr-2">
                    Sí
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hadPreviousPets" [value]="false" name="hadPreviousPets" class="mr-2">
                    No
                  </label>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Si los tienes, ¿están esterilizados?</label>
                  <div class="flex gap-4">
                    <label class="flex items-center">
                      <input type="radio" [(ngModel)]="formData.petsSterilized" [value]="true" name="petsSterilized" class="mr-2">
                      Sí
                    </label>
                    <label class="flex items-center">
                      <input type="radio" [(ngModel)]="formData.petsSterilized" [value]="false" name="petsSterilized" class="mr-2">
                      No
                    </label>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">¿Por qué?</label>
                  <textarea [(ngModel)]="formData.sterilizationReason" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Parte 2: Hogar -->
          <div class="bg-gray-50 p-6 rounded-xl">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Parte 2: Hogar</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Hay niños en casa?</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hasChildren" [value]="true" name="hasChildren" class="mr-2">
                    Sí
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hasChildren" [value]="false" name="hasChildren" class="mr-2">
                    No
                  </label>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Edades</label>
                <input type="text" [(ngModel)]="formData.childrenAges"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Cuántas personas viven en casa?</label>
                <input type="text" [(ngModel)]="formData.householdSize"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Están todos de acuerdo?</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.allAgree" [value]="true" name="allAgree" class="mr-2">
                    Sí
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.allAgree" [value]="false" name="allAgree" class="mr-2">
                    No
                  </label>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Alguien es alérgico al pelo de gato?</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.anyAllergies" [value]="true" name="anyAllergies" class="mr-2">
                    Sí
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.anyAllergies" [value]="false" name="anyAllergies" class="mr-2">
                    No
                  </label>
                </div>
              </div>
            </div>
            
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Si cambias de domicilio, ¿qué pasaría con el gatito?</label>
                <textarea [(ngModel)]="formData.movingPlans" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Vivienda</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.livingType" value="alquiler-permiten" name="livingType" class="mr-2">
                    En alquiler (permiten mascotas)
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.livingType" value="alquiler-no-permiten" name="livingType" class="mr-2">
                    En alquiler (NO permiten)
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.livingType" value="no-se" name="livingType" class="mr-2">
                    No sé
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.livingType" value="casa-propia" name="livingType" class="mr-2">
                    Casa propia
                  </label>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ruptura/llegada de integrante, ¿qué cambiaría?</label>
                <textarea [(ngModel)]="formData.movingPlans" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"></textarea>
              </div>
            </div>
          </div>

          <!-- Parte 3: Recreación y proyección -->
          <div class="bg-gray-50 p-6 rounded-xl">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Parte 3: Recreación y proyección</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Tienes espacio suficiente?</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hasSpace" [value]="true" name="hasSpace" class="mr-2">
                    Sí
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hasSpace" [value]="false" name="hasSpace" class="mr-2">
                    No
                  </label>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿En qué áreas podrá ingresar?</label>
                <textarea [(ngModel)]="formData.accessAreas" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Dónde dormirá?</label>
                <textarea [(ngModel)]="formData.sleepingPlace" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Existen espacios por los que pueda escaparse?</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hasEscapeSpaces" [value]="true" name="hasEscapeSpaces" class="mr-2">
                    Sí
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hasEscapeSpaces" [value]="false" name="hasEscapeSpaces" class="mr-2">
                    No
                  </label>
                </div>
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Si el comportamiento no es el deseado (juguetón, mordelón, inquieto, etc.), ¿qué harías?</label>
              <textarea [(ngModel)]="formData.behaviorIssuesResponse" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"></textarea>
            </div>
          </div>

          <!-- Parte 4: Cuidados y gastos -->
          <div class="bg-gray-50 p-6 rounded-xl">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Parte 4: Cuidados y gastos</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Quién cubriría los gastos?</label>
                <input type="text" [(ngModel)]="formData.whoPaysExpenses"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Cuentas con recursos para gastos veterinarios?</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hasVetResources" [value]="true" name="hasVetResources" class="mr-2">
                    Sí
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.hasVetResources" [value]="false" name="hasVetResources" class="mr-2">
                    No
                  </label>
                </div>
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Cuidados que brindarás</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label class="flex items-center">
                  <input type="checkbox" value="visitas-veterinario" class="mr-2">
                  Visitas periódicas al veterinario
                </label>
                <label class="flex items-center">
                  <input type="checkbox" value="vacunacion-vitaminas" class="mr-2">
                  Vacunación y vitaminas
                </label>
                <label class="flex items-center">
                  <input type="checkbox" value="placa-identificacion" class="mr-2">
                  Uso de placa de identificación
                </label>
                <label class="flex items-center">
                  <input type="checkbox" value="agua-limpia" class="mr-2">
                  Agua limpia todos los días
                </label>
                <label class="flex items-center">
                  <input type="checkbox" value="desparasitacion" class="mr-2">
                  Desparasitación
                </label>
                <label class="flex items-center">
                  <input type="checkbox" value="cepillado-pelo" class="mr-2">
                  Cepillado de pelo
                </label>
                <label class="flex items-center">
                  <input type="checkbox" value="limpieza-arenero" class="mr-2">
                  Limpieza diaria de arenero
                </label>
                <label class="flex items-center">
                  <input type="checkbox" value="alimentacion-croquetas" class="mr-2">
                  Alimentación solo con croquetas
                </label>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Te comprometes a esterilizar a los 5 meses?</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.sterilizeCommitment" [value]="true" name="sterilizeCommitment" class="mr-2">
                    Sí
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.sterilizeCommitment" [value]="false" name="sterilizeCommitment" class="mr-2">
                    No
                  </label>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Aceptas visitas periódicas al domicilio?</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.acceptsVisits" [value]="true" name="acceptsVisits" class="mr-2">
                    Sí
                  </label>
                  <label class="flex items-center">
                    <input type="radio" [(ngModel)]="formData.acceptsVisits" [value]="false" name="acceptsVisits" class="mr-2">
                    No
                  </label>
                </div>
              </div>
            </div>
            
            <div class="mt-4">
              <label class="flex items-center">
                <input type="checkbox" [(ngModel)]="formData.acceptsTerms" class="mr-2">
                <span class="text-sm text-gray-700">Acepto las condiciones del proceso de adopción.</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="sticky bottom-0 bg-white p-6 border-t border-gray-200 rounded-b-2xl">
          <div class="flex gap-4 justify-end">
            <button (click)="closeForm()" 
                    class="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              Cancelar
            </button>
            <button (click)="submitForm()" 
                    [disabled]="!isFormValid()"
                    class="px-8 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Enviar solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdoptionFormComponent implements OnInit {
  @Input() catId: string = '';
  @Output() formClosed = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<AdoptionFormData>();

  formData: AdoptionFormData = {
    catId: '',
    fullName: '',
    phone: '',
    birthDate: '',
    city: '',
    dni: '',
    civilStatus: '',
    occupation: '',
    address: '',
    district: '',
    email: '',
    instagram: '',
    facebook: '',
    whyAdopt: '',
    hasCurrentPets: false,
    currentPetsDetails: '',
    hadPreviousPets: false,
    previousPetsDetails: '',
    petsWhereAreNow: '',
    petsSterilized: false,
    sterilizationReason: '',
    hasChildren: false,
    childrenAges: '',
    householdSize: '',
    allAgree: false,
    anyAllergies: false,
    livingType: '',
    movingPlans: '',
    hasSpace: false,
    accessAreas: '',
    sleepingPlace: '',
    hasEscapeSpaces: false,
    behaviorIssuesResponse: '',
    whoPaysExpenses: '',
    hasVetResources: false,
    careCommitments: [],
    sterilizeCommitment: false,
    acceptsVisits: false,
    acceptsTerms: false
  };

  ngOnInit() {
    this.formData.catId = this.catId;
  }

  closeForm() {
    this.formClosed.emit();
  }

  submitForm() {
    if (this.isFormValid()) {
      this.formSubmitted.emit(this.formData);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.formData.fullName &&
      this.formData.email &&
      this.formData.acceptsTerms
    );
  }
}