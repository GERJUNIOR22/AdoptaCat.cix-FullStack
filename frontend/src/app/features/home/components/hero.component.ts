import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100">
      <div class="container mx-auto px-4 py-24 md:py-32">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <!-- Left: Text Content -->
          <div class="space-y-8 animate-fade-in-up">
            <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight text-gray-800">
              Somos la voz
              <br />
              de los
              <br />
              gatos
            </h1>
            <p class="text-lg text-gray-600 leading-relaxed max-w-md">
              Dale a un gato amoroso un hogar para siempre. Explora nuestros gatos adoptables y descubre tu nuevo mejor
              amigo hoy.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button class="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all hover:scale-105">
                Ver Gatos
              </button>
              <button class="border-2 border-gray-300 hover:border-purple-500 text-gray-700 hover:text-purple-600 px-8 py-3 rounded-full text-lg font-medium transition-all hover:scale-105 bg-transparent">
                Saber Más
              </button>
            </div>
          </div>

          <!-- Right: Image Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4 animate-fade-in-up" style="animation-delay: 0.1s">
              <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 hover:scale-105 transition-transform duration-300">
                <div class="w-full h-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center">
                  <span class="text-white font-semibold">Gato Naranja</span>
                </div>
              </div>
            </div>
            <div class="space-y-4 pt-12 animate-fade-in-up" style="animation-delay: 0.2s">
              <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 hover:scale-105 transition-transform duration-300">
                <div class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                  <span class="text-white font-semibold">Gato Gris</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
      transform: translateY(30px);
    }
    
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .text-balance {
      text-wrap: balance;
    }
  `]
})
export class HeroComponent {

}