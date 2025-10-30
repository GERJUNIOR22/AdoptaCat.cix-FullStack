import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <!-- Columna 1: AdoptaCat -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-white mb-4 font-sans">AdoptaCat</h3>
            <p class="text-rose-100 text-sm leading-relaxed font-reading">
              Conectando gatos con hogares amorosos desde 2020.
            </p>
          </div>

          <!-- Columna 2: Enlaces Rápidos -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4 font-sans">Enlaces Rápidos</h4>
            <ul class="space-y-3 text-sm font-reading">
              <li>
                <a [routerLink]="['/adopta']" class="text-rose-100 hover:text-white transition-colors">
                  Gatos Disponibles
                </a>
              </li>
              <li>
                <a [routerLink]="['/nosotros']" class="text-rose-100 hover:text-white transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a [routerLink]="['/donaciones']" class="text-rose-100 hover:text-white transition-colors">
                  Donaciones
                </a>
              </li>
              <li>
                <a [routerLink]="['/blog']" class="text-rose-100 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <!-- Columna 3: Recursos -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4 font-sans">Recursos</h4>
            <ul class="space-y-3 text-sm font-reading">
              <li>
                <span class="text-rose-100 text-sm">Guía de Cuidado de Gatos</span>
                <br><small class="text-rose-200">Próximamente en nuestro blog</small>
              </li>
              <li>
                <span class="text-rose-100 text-sm">Preguntas Frecuentes</span>
                <br><small class="text-rose-200">Ver sección en Inicio</small>
              </li>
              <li>
                <span class="text-rose-100 text-sm">Historias de Éxito</span>
                <br><small class="text-rose-200">Síguenos en redes sociales</small>
              </li>
            </ul>
          </div>

          <!-- Columna 4: Conecta -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4 font-sans">Conecta</h4>
            <ul class="space-y-3 text-sm font-reading">
              <li>
                <a href="https://www.instagram.com/adopcat.cix/" target="_blank" class="text-rose-100 hover:text-white transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@adopcat.cix" target="_blank" class="text-rose-100 hover:text-white transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                  </svg>
                  TikTok
                </a>
              </li>
            </ul>
            <div class="mt-6 p-4 bg-rose-600 bg-opacity-50 rounded-lg border border-rose-400 border-opacity-30">
              <p class="text-white text-xs mb-2 font-medium font-sans">Síguenos en redes sociales:</p>
              <p class="text-rose-100 text-xs font-reading">
                Instagram y TikTok para adopciones, consultas y contenido sobre gatos
              </p>
            </div>
          </div>
        </div>

        <!-- Línea divisoria -->
        <div class="border-t border-rose-400 border-opacity-30 mt-12 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-rose-100 text-sm font-reading">
              © 2025 AdoptaCat. Todos los derechos reservados. Dedicados a la creatividad, cultura y gatos.
            </p>
            <div class="flex items-center gap-6 mt-4 md:mt-0">
              <span class="text-rose-200 text-sm hover:text-white cursor-pointer transition-colors font-reading">Política de Privacidad</span>
              <span class="text-rose-200 text-sm hover:text-white cursor-pointer transition-colors font-reading">Términos de Uso</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background: linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #f43f5e 100%);
      position: relative;
    }
    
    footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.9) 0%, rgba(236, 72, 153, 0.9) 100%);
      pointer-events: none;
    }
    
    footer > * {
      position: relative;
      z-index: 1;
    }
  `]
})
export class FooterComponent {

}