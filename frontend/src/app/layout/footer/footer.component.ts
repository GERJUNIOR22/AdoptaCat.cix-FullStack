import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <!-- Columna 1: AdoptaCat -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-white mb-4">AdoptaCat</h3>
            <p class="text-gray-300 text-sm leading-relaxed">
              Conectando gatos con hogares amorosos desde 2020.
            </p>
          </div>

          <!-- Columna 2: Enlaces Rápidos -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h4>
            <ul class="space-y-3 text-sm">
              <li>
                <a [routerLink]="['/adopta']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Gatos Disponibles
                </a>
              </li>
              <li>
                <a [routerLink]="['/nosotros']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a [routerLink]="['/donaciones']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Donaciones
                </a>
              </li>
              <li>
                <a [routerLink]="['/blog']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <!-- Columna 3: Recursos -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4">Recursos</h4>
            <ul class="space-y-3 text-sm">
              <li>
                <span class="text-gray-500 text-sm">Guía de Cuidado de Gatos</span>
                <br><small class="text-gray-600">Próximamente en nuestro blog</small>
              </li>
              <li>
                <span class="text-gray-500 text-sm">Preguntas Frecuentes</span>
                <br><small class="text-gray-600">Ver sección en Inicio</small>
              </li>
              <li>
                <span class="text-gray-500 text-sm">Historias de Éxito</span>
                <br><small class="text-gray-600">Síguenos en redes sociales</small>
              </li>
            </ul>
          </div>

          <!-- Columna 4: Conecta -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4">Conecta</h4>
            <ul class="space-y-3 text-sm">
              <li>
                <a href="https://www.instagram.com/adopcat.cix/" target="_blank" class="text-gray-300 hover:text-pink-400 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@adopcat.cix" target="_blank" class="text-gray-300 hover:text-pink-400 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                  </svg>
                  TikTok
                </a>
              </li>
            </ul>
            <div class="mt-6 p-4 bg-gray-800 rounded-lg">
              <p class="text-gray-300 text-xs mb-2">Síguenos en redes sociales:</p>
              <p class="text-gray-400 text-xs">
                Instagram y TikTok para adopciones, consultas y contenido sobre gatos
              </p>
            </div>
          </div>
        </div>

        <!-- Línea divisoria -->
        <div class="border-t border-gray-700 mt-12 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm">
              © 2025 AdoptaCat. Todos los derechos reservados. Dedicados a la creatividad, cultura y gatos.
            </p>
            <div class="flex items-center gap-6 mt-4 md:mt-0">
              <span class="text-gray-500 text-sm">Política de Privacidad</span>
              <span class="text-gray-500 text-sm">Términos de Uso</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    }
    
    .newsletter-gradient {
      background: linear-gradient(45deg, #6366f1, #8b5cf6);
    }
  `]
})
export class FooterComponent {

}