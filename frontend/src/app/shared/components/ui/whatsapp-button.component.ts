import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WhatsappConfigService } from '../../services/whatsapp-config.service';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50">
      <button
        (click)="openWhatsApp()"
        class="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group relative"
        [class.opacity-75]="!isAvailable"
        title="Contáctanos por WhatsApp"
      >
        <!-- Ícono de WhatsApp -->
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          class="transition-transform group-hover:rotate-12"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
        
        <!-- Indicador de disponibilidad -->
        <div 
          class="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
          [class.bg-green-400]="isAvailable"
          [class.bg-yellow-400]="!isAvailable"
          [class.animate-pulse]="isAvailable"
        ></div>
      </button>
      
      <!-- Tooltip -->
      <div class="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div class="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap max-w-xs font-sans">
          {{ getTooltipMessage() }}
          <div class="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0);
      }
      40%, 43% {
        transform: translate3d(0,-8px,0);
      }
      70% {
        transform: translate3d(0,-4px,0);
      }
      90% {
        transform: translate3d(0,-2px,0);
      }
    }
    
    button:hover {
      animation: bounce 1s ease-in-out;
    }
    
    @media (max-width: 768px) {
      .fixed {
        bottom: 1rem;
        right: 1rem;
      }
    }
  `]
})
export class WhatsappButtonComponent {
  private readonly router = inject(Router);
  private readonly whatsappConfig = inject(WhatsappConfigService);

  get isAvailable(): boolean {
    return this.whatsappConfig.isAvailable();
  }

  getTooltipMessage(): string {
    if (this.isAvailable) {
      return '¡Chatea con nosotros! 🐱💬';
    } else {
      return 'Fuera de horario de atención 🌙';
    }
  }

  getCurrentPage(): string {
    const currentUrl = this.router.url;
    
    if (currentUrl.includes('/adopta')) {
      return 'adopta';
    } else if (currentUrl.includes('/donaciones')) {
      return 'donaciones';
    } else if (currentUrl.includes('/apadrina')) {
      return 'apadrina';
    } else if (currentUrl.includes('/nosotros')) {
      return 'nosotros';
    } else if (currentUrl.includes('/blog')) {
      return 'blog';
    } else {
      return 'home';
    }
  }

  openWhatsApp(): void {
    const currentPage = this.getCurrentPage();
    const message = this.whatsappConfig.getMessageForPage(currentPage);
    const whatsappUrl = this.whatsappConfig.getWhatsAppUrl(message);
    
    // Abrir en nueva ventana
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Analytics opcional
    console.log('WhatsApp button clicked from:', this.router.url);
    
    // Opcional: Agregar evento de analytics
    if ((globalThis as any).gtag !== undefined) {
      (globalThis as any).gtag('event', 'whatsapp_click', {
        'event_category': 'engagement',
        'event_label': currentPage,
        'page': this.router.url
      });
    }
  }
}