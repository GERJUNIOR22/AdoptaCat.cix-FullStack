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
          <!-- Luna -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="h-64 bg-gradient-to-br from-gray-800 to-gray-600 relative overflow-hidden">
              <img 
                src="assets/gatos/miel.webp" 
                alt="Luna - gato doméstico" 
                class="w-full h-full object-cover"
              />
              <div class="absolute bottom-4 left-4 text-white">
                <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Luna</h3>
              <p class="text-pink-600 font-medium mb-1">Doméstico Pelo Corto</p>
              <p class="text-gray-600 mb-3">2 años</p>
              <p class="text-pink-600 font-medium mb-4">Juguetona y Cariñosa</p>
              <a [routerLink]="['/adopta', 'luna']" class="w-full bg-gradient-to-r from-pink-100 to-orange-100 hover:from-pink-200 hover:to-orange-200 text-gray-700 py-3 rounded-lg transition-colors font-medium inline-block text-center">
                Conocer más
              </a>
            </div>
          </div>

          <!-- Oliver -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="h-64 bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden">
              <img 
                src="assets/gatos/milaneso.webp" 
                alt="Oliver - gato atigrado" 
                class="w-full h-full object-cover"
              />
              <div class="absolute bottom-4 left-4 text-white">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Oliver</h3>
              <p class="text-orange-600 font-medium mb-1">Atigrado</p>
              <p class="text-gray-600 mb-3">3 años</p>
              <p class="text-orange-600 font-medium mb-4">Tranquilo y Gentil</p>
              <a [routerLink]="['/adopta', 'oliver']" class="w-full bg-gradient-to-r from-pink-100 to-orange-100 hover:from-pink-200 hover:to-orange-200 text-gray-700 py-3 rounded-lg transition-colors font-medium inline-block text-center">
                Conocer más
              </a>
            </div>
          </div>

          <!-- Milo -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="h-64 bg-gradient-to-br from-pink-200 to-orange-300 relative">
              <!-- Placeholder para imagen de Milo - gato siamés -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-32 h-32 bg-pink-300 rounded-full opacity-80"></div>
              </div>
              <div class="absolute bottom-4 left-4 text-white">
                <div class="w-3 h-3 bg-pink-500 rounded-full"></div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Milo</h3>
              <p class="text-pink-600 font-medium mb-1">Siamés Mestizo</p>
              <p class="text-gray-600 mb-3">1 año</p>
              <p class="text-pink-600 font-medium mb-4">Curioso y Vocal</p>
              <a [routerLink]="['/adopta', 'milo']" class="w-full bg-gradient-to-r from-pink-100 to-orange-100 hover:from-pink-200 hover:to-orange-200 text-gray-700 py-3 rounded-lg transition-colors font-medium inline-block text-center">
                Conocer más
              </a>
            </div>
          </div>
        </div>

        <!-- Botón Ver todos los gatos -->
        <div class="text-center">
          <a [routerLink]="['/adopta']" class="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-medium transition-colors inline-block">
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

  constructor(private readonly catsService: CatsService) {}

  ngOnInit(): void {
    this.catsService.getCats().subscribe(cats => {
      this.cats = cats;
    });
  }

  get displayCats() {
    return this.limit ? this.cats.slice(0, this.limit) : this.cats;
  }
}