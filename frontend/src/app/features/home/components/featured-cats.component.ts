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
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Adopta</h2>
          <p class="text-lg text-gray-600">¡Cientos de gatos esperan por un hogar!</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <!-- Luna -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="h-64 bg-gradient-to-br from-gray-800 to-gray-600 relative">
              <!-- Placeholder para imagen de Luna - gato negro -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-32 h-32 bg-black rounded-full opacity-80"></div>
              </div>
              <div class="absolute bottom-4 left-4 text-white">
                <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Luna</h3>
              <p class="text-purple-600 font-medium mb-1">Doméstico Pelo Corto</p>
              <p class="text-gray-600 mb-3">2 años</p>
              <p class="text-purple-600 font-medium mb-4">Juguetona y Cariñosa</p>
              <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors font-medium">
                Conocer más
              </button>
            </div>
          </div>

          <!-- Oliver -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="h-64 bg-gradient-to-br from-orange-400 to-orange-600 relative">
              <!-- Placeholder para imagen de Oliver - gato atigrado -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-32 h-32 bg-orange-500 rounded-full opacity-80"></div>
              </div>
              <div class="absolute bottom-4 left-4 text-white">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Oliver</h3>
              <p class="text-purple-600 font-medium mb-1">Atigrado</p>
              <p class="text-gray-600 mb-3">3 años</p>
              <p class="text-purple-600 font-medium mb-4">Tranquilo y Gentil</p>
              <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors font-medium">
                Conocer más
              </button>
            </div>
          </div>

          <!-- Milo -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="h-64 bg-gradient-to-br from-blue-200 to-blue-400 relative">
              <!-- Placeholder para imagen de Milo - gato siamés -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-32 h-32 bg-blue-300 rounded-full opacity-80"></div>
              </div>
              <div class="absolute bottom-4 left-4 text-white">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Milo</h3>
              <p class="text-purple-600 font-medium mb-1">Siamés Mestizo</p>
              <p class="text-gray-600 mb-3">1 año</p>
              <p class="text-purple-600 font-medium mb-4">Curioso y Vocal</p>
              <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors font-medium">
                Conocer más
              </button>
            </div>
          </div>
        </div>

        <!-- Botón Ver todos los gatos -->
        <div class="text-center">
          <button class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
            Ver todos los gatos
          </button>
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
    this.cats = this.catsService.getCats();
  }

  get displayCats() {
    return this.limit ? this.cats.slice(0, this.limit) : this.cats;
  }
}