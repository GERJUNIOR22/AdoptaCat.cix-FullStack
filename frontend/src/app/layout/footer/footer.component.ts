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
                <a [routerLink]="['/gatos']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Gatos Disponibles
                </a>
              </li>
              <li>
                <a [routerLink]="['/nosotros']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a [routerLink]="['/adopcion']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Proceso de Adopción
                </a>
              </li>
              <li>
                <a [routerLink]="['/contacto']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <!-- Columna 3: Recursos -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4">Recursos</h4>
            <ul class="space-y-3 text-sm">
              <li>
                <a [routerLink]="['/guia-cuidados']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Guía de Cuidado de Gatos
                </a>
              </li>
              <li>
                <a [routerLink]="['/faq']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a [routerLink]="['/historias']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Historias de Éxito
                </a>
              </li>
              <li>
                <a [routerLink]="['/voluntariado']" class="text-gray-300 hover:text-purple-400 transition-colors">
                  Voluntariado
                </a>
              </li>
            </ul>
          </div>

          <!-- Columna 4: Conecta -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4">Conecta</h4>
            <ul class="space-y-3 text-sm">
              <li>
                <a href="https://instagram.com/adoptacat" target="_blank" class="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com/adoptacat" target="_blank" class="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com/adoptacat" target="_blank" class="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  Twitter
                </a>
              </li>
              <li>
                <a href="mailto:newsletter@adoptacat.pe" class="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Línea divisoria -->
        <div class="border-t border-gray-700 mt-12 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm">
              © 2025 AdoptaCat. Todos los derechos reservados. Dedicados a la creatividad, cultura y gatos.
            </p>
            <div class="flex items-center gap-6 mt-4 md:mt-0">
              <a [routerLink]="['/privacidad']" class="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Política de Privacidad
              </a>
              <a [routerLink]="['/terminos']" class="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Términos de Uso
              </a>
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