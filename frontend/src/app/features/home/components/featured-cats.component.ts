import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatsService } from '../../../core/services/cats.service';
import { Cat } from '../../../shared/models/cat.model';

@Component({
  selector: 'app-featured-cats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Adopta</h2>
          <p class="text-lg text-gray-600">¡Cientos de gatos esperan por un hogar!</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <!-- Mostrar gatos dinámicamente desde la base de datos -->
          <div *ngFor="let cat of displayCats" 
               class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="h-64 bg-gradient-to-br from-gray-800 to-gray-600 relative overflow-hidden">
              <img 
                [src]="cat.mainImageUrl || cat.image || 'assets/gatos/default.webp'" 
                [alt]="cat.name + ' - ' + (cat.breed || 'gato')" 
                class="w-full h-full object-cover"
                (error)="onImageError($event)"
              />
              <div class="absolute bottom-4 left-4 text-white">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ cat.name }}</h3>
              <p class="text-pink-600 font-medium mb-1">{{ cat.breed || 'Mestizo' }}</p>
              <p class="text-gray-600 mb-3">{{ formatAge(cat.age, cat.edadMeses) }}</p>
              <p class="text-pink-600 font-medium mb-4">{{ formatPersonality(cat.personality) }}</p>
              <a [routerLink]="['/adopta', cat.id]" 
                 class="w-full bg-gradient-to-r from-pink-100 to-orange-100 hover:from-pink-200 hover:to-orange-200 text-gray-700 py-3 rounded-lg transition-colors font-medium inline-block text-center">
                Conocer más
              </a>
            </div>
          </div>

          <!-- Mensaje si no hay gatos -->
          <div *ngIf="displayCats.length === 0" class="col-span-full text-center py-12">
            <p class="text-gray-500 text-lg">No hay gatos disponibles en este momento.</p>
          </div>
        </div>

        <!-- Botón Ver todos los gatos -->
        <div class="text-center">
          <a [routerLink]="['/adopta']" 
             class="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-medium transition-colors inline-block">
            Ver todos los gatos
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .bg-gradient-to-br {
      background-image: linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to));
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .hover\\:shadow-xl:hover {
      animation: float 3s ease-in-out infinite;
    }
  `]
})
export class FeaturedCatsComponent implements OnInit {
  @Input() limit?: number;

  cats: Cat[] = [];

  constructor(private readonly catsService: CatsService) { }

  ngOnInit(): void {
    this.catsService.getCats().subscribe(cats => {
      this.cats = cats;
      console.log('Gatos cargados:', cats);
    });
  }

  get displayCats() {
    return this.limit ? this.cats.slice(0, this.limit) : this.cats;
  }

  formatAge(age: number | string | undefined, edadMeses: number | undefined): string {
    if (age) {
      if (typeof age === 'number') {
        return age === 1 ? '1 año' : `${age} años`;
      }
      return age;
    }
    if (edadMeses !== undefined) {
      if (edadMeses < 12) {
        return `${edadMeses} ${edadMeses === 1 ? 'mes' : 'meses'}`;
      }
      const years = Math.floor(edadMeses / 12);
      return years === 1 ? '1 año' : `${years} años`;
    }
    return 'Edad desconocida';
  }

  formatPersonality(personality: string | string[] | undefined): string {
    if (!personality) return 'Amigable';
    if (Array.isArray(personality)) {
      return personality.slice(0, 2).join(' y ');
    }
    return personality;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/gatos/default.webp';
  }
}