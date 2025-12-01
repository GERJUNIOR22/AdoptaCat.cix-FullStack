import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CatsService } from '../../../core/services/cats.service';
import { Cat } from '../../../shared/models/cat.model';

@Component({
  selector: 'app-adoption',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800 text-white py-20">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-4xl mx-auto">
            <h1 class="text-5xl font-bold mb-6">Adopta un Gato</h1>
            <p class="text-xl mb-8 text-rose-100">
              Conoce a nuestros adorables gatos que están buscando un hogar lleno de amor.
              Cada uno tiene una historia única y está listo para convertirse en tu mejor amigo.
            </p>
            <div class="flex justify-center">
              <button class="bg-white text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Ver Proceso de Adopción
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Filtros -->
      <section class="py-8 bg-white shadow-sm">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap gap-4 justify-center">
            <button 
              (click)="setFilter('all')"
              [class]="selectedFilter() === 'all' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              class="px-6 py-2 rounded-full font-medium transition-colors">
              Todos los Gatos
            </button>
            <button 
              (click)="setFilter('kitten')"
              [class]="selectedFilter() === 'kitten' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              class="px-6 py-2 rounded-full font-medium transition-colors">
              Gatitos (< 1 año)
            </button>
            <button 
              (click)="setFilter('adult')"
              [class]="selectedFilter() === 'adult' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              class="px-6 py-2 rounded-full font-medium transition-colors">
              Adultos
            </button>
            <button 
              (click)="setFilter('special')"
              [class]="selectedFilter() === 'special' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              class="px-6 py-2 rounded-full font-medium transition-colors">
              Casos Especiales
            </button>
          </div>
        </div>
      </section>

      <!-- Grid de Gatos -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">¡Cientos de gatos esperan por un hogar!</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Cada uno de nuestros gatos ha sido cuidadosamente rescatado, rehabilitado y evaluado por nuestro equipo veterinario.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let cat of filteredCats()" 
                 class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              
              <!-- Imagen del gato -->
              <div class="relative h-64 overflow-hidden cursor-pointer" (click)="openCatModal(cat)">
                <img [src]="getImageUrl(cat.mainImageUrl || cat.image || '')" [alt]="cat.name" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                <div class="absolute top-4 right-4 flex gap-2">
                  <span *ngIf="cat.isSpecialNeeds" class="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Especial
                  </span>
                  <span [class]="isMale(cat) ? 'bg-blue-500' : 'bg-pink-500'" 
                        class="text-white px-2 py-1 rounded-full text-xs font-medium">
                    {{ isMale(cat) ? '♂ Macho' : '♀ Hembra' }}
                  </span>
                </div>
                <div class="absolute bottom-4 left-4 flex gap-2">
                  <span *ngIf="cat.vaccinated || cat.isVaccinated" class="bg-green-500 text-white p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                  </span>
                  <span *ngIf="cat.sterilized || cat.isSterilized" class="bg-blue-500 text-white p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.75 17 9 20l-1 1h8l-1-1-.75-3"/><path d="M2 14h20"/><path d="M2 9h20"/><path d="M9 22v-4h6v4"/><path d="M12 6V2H8"/></svg>
                  </span>
                </div>
              </div>

              <!-- Información del gato -->
              <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="text-2xl font-bold text-gray-900">{{ cat.name }}</h3>
                  <span class="text-lg text-gray-600">{{ getAgeDisplay(cat) }}</span>
                </div>
                
                <p class="text-rose-600 font-medium mb-2">{{ cat.breed }}</p>
                <p class="text-rose-500 text-sm mb-4">{{ getPersonalityDisplay(cat) }}</p>
                <p class="text-gray-600 text-sm mb-6 leading-relaxed">{{ cat.description }}</p>
                
                <!-- Estado de salud -->
                <div class="flex gap-4 mb-6 text-xs">
                  <div class="flex items-center gap-1">
                    <div [class]="(cat.vaccinated || cat.isVaccinated) ? 'bg-green-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full"></div>
                    <span class="text-gray-600">Vacunado</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <div [class]="(cat.sterilized || cat.isSterilized) ? 'bg-green-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full"></div>
                    <span class="text-gray-600">Esterilizado</span>
                  </div>
                </div>

                <!-- Botones de acción -->
                <div class="flex gap-3">
                  <button 
                    (click)="openCatModal(cat)"
                    class="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg font-medium transition-colors">
                    Conocer más
                  </button>
                  <button 
                    (click)="startAdoption(cat)"
                    class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    ❤️ Adoptar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón Ver Más -->
          <div class="text-center mt-12">
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium transition-colors">
              Ver más gatos
            </button>
          </div>
        </div>
      </section>

      <!-- Sección de Información -->
      <section class="py-16 bg-white">
        <!-- ... (same as before) ... -->
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-6">¿Listo para adoptar?</h2>
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-purple-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-1">Elige tu compañero perfecto</h3>
                    <p class="text-gray-600 text-sm">Navega por nuestros gatos disponibles y encuentra el que conecte contigo.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-purple-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-1">Completa el proceso</h3>
                    <p class="text-gray-600 text-sm">Llena el formulario de adopción y programa una visita.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-1">Lleva a casa la felicidad</h3>
                    <p class="text-gray-600 text-sm">Después de la aprobación, tu nuevo amigo estará listo para ir contigo.</p>
                  </div>
                </div>
              </div>
              <div class="mt-8">
                <button class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
                  Comenzar Adopción
                </button>
              </div>
            </div>
            <div class="relative">
              <img src="assets/adoptacat/familia-gato-adoptado.webp" alt="Familia feliz con gato adoptado" class="rounded-2xl h-96 w-full object-cover shadow-lg">
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal de Gato -->
    <div *ngIf="selectedCat()" class="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm p-4" (click)="closeModal()">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="relative">
          <img [src]="getImageUrl(selectedCat()?.mainImageUrl || selectedCat()?.image || '')" [alt]="selectedCat()?.name || ''" class="w-full h-80 object-cover">
          <button (click)="closeModal()" class="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div class="p-8">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-3xl font-bold text-gray-900">{{ selectedCat()?.name }}</h2>
            <span class="text-xl text-gray-600">{{ getAgeDisplay(selectedCat()) }}</span>
          </div>
          
          <div class="mb-6">
            <p class="text-purple-600 font-medium text-lg mb-2">{{ selectedCat()?.breed }}</p>
            <p class="text-purple-500 mb-4">{{ getPersonalityDisplay(selectedCat()) }}</p>
            <p class="text-gray-600 leading-relaxed">{{ selectedCat()?.description }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">Estado de Salud</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <div [class]="(selectedCat()?.vaccinated || selectedCat()?.isVaccinated) ? 'bg-green-500' : 'bg-red-500'" class="w-3 h-3 rounded-full"></div>
                  <span>{{ (selectedCat()?.vaccinated || selectedCat()?.isVaccinated) ? 'Vacunado ✓' : 'No vacunado ✗' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div [class]="(selectedCat()?.sterilized || selectedCat()?.isSterilized) ? 'bg-green-500' : 'bg-red-500'" class="w-3 h-3 rounded-full"></div>
                  <span>{{ (selectedCat()?.sterilized || selectedCat()?.isSterilized) ? 'Esterilizado ✓' : 'No esterilizado ✗' }}</span>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">Características</h4>
              <div class="space-y-1 text-sm text-gray-600">
                <p>Sexo: {{ isMale(selectedCat()) ? 'Macho' : 'Hembra' }}</p>
                <p *ngIf="selectedCat()?.isSpecialNeeds" class="text-orange-600">⚠️ Caso Especial</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button 
              (click)="startAdoption(selectedCat()!)"
              class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
              ❤️ Quiero Adoptar a {{ selectedCat()?.name }}
            </button>
            <button 
              (click)="closeModal()"
              class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-cat-1 { background: linear-gradient(45deg, #374151, #111827), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="%23fbbf24"/></svg>') center/cover; }
    .bg-cat-2 { background: linear-gradient(45deg, #ea580c, #dc2626), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="%23fb923c"/></svg>') center/cover; }
    .bg-cat-3 { background: linear-gradient(45deg, #0ea5e9, #0284c7), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="%2338bdf8"/></svg>') center/cover; }
    .bg-cat-4 { background: linear-gradient(45deg, #f97316, #ea580c); }
    .bg-cat-5 { background: linear-gradient(45deg, #eab308, #ca8a04); }
    .bg-cat-6 { background: linear-gradient(45deg, #6b7280, #4b5563); }
  `]
})
export class AdoptionComponent implements OnInit {
  private titleService = inject(Title);
  private catsService = inject(CatsService);

  // Signal para el filtro seleccionado
  public selectedFilter = signal<string>('all');

  // Signal para el gato seleccionado en el modal
  public selectedCat = signal<Cat | null>(null);

  // Signal para la lista de gatos
  public cats = signal<Cat[]>([]);

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle('Adopta | AdopCat');
    this.loadCats();
  }

  private loadCats() {
    this.catsService.getCats().subscribe(cats => {
      console.log('Gatos recibidos del servicio:', cats);
      this.cats.set(cats);
    });
  }

  // Método para cambiar el filtro
  public setFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  // Computed para gatos filtrados
  public filteredCats(): Cat[] {
    const filter = this.selectedFilter();
    const cats = this.cats();

    switch (filter) {
      case 'kitten':
        return cats.filter(cat => {
          if (cat.edadMeses !== undefined) return cat.edadMeses < 12;
          if (typeof cat.age === 'number') return cat.age < 1;
          if (typeof cat.age === 'string') return cat.age.includes('meses');
          return false;
        });
      case 'adult':
        return cats.filter(cat => {
          if (cat.edadMeses !== undefined) return cat.edadMeses >= 12;
          if (typeof cat.age === 'number') return cat.age >= 1;
          if (typeof cat.age === 'string') return !cat.age.includes('meses');
          return true;
        });
      case 'special':
        return cats.filter(cat => cat.isSpecialNeeds);
      default:
        return cats;
    }
  }

  // Método para navegar al perfil del gato
  public openCatModal(cat: Cat): void {
    this.selectedCat.set(cat);
  }

  // Método para cerrar modal
  public closeModal(): void {
    this.selectedCat.set(null);
  }

  // Método para iniciar proceso de adopción
  public startAdoption(cat: Cat): void {
    alert(`¡Genial! Has elegido adoptar a ${cat.name}. Te contactaremos pronto para iniciar el proceso de adopción.`);
    this.closeModal();
  }

  public getImageUrl(image: string): string {
    return this.catsService.getImageUrl(image);
  }

  public getAgeDisplay(cat: Cat | null): string {
    if (!cat) return '';
    if (cat.edadMeses) {
      return cat.edadMeses < 12 ? `${cat.edadMeses} meses` : `${Math.floor(cat.edadMeses / 12)} años`;
    }
    if (typeof cat.age === 'number') {
      return `${cat.age} años`;
    }
    return cat.age || '';
  }

  public getPersonalityDisplay(cat: Cat | null): string {
    if (!cat || !cat.personality) return '';
    if (Array.isArray(cat.personality)) {
      return cat.personality.join(', ');
    }
    return cat.personality;
  }

  public isMale(cat: Cat | null): boolean {
    if (!cat) return false;
    return cat.gender === 'male' || cat.gender === 'MALE';
  }
}
