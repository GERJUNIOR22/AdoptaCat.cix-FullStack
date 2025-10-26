import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2" [class]="containerClass">
      <img 
        src="assets/adoptacat/logo.svg" 
        [alt]="altText" 
        [class]="imageClass"
        class="transition-transform duration-300 hover:scale-105"
      >
      <span 
        *ngIf="showText" 
        [class]="textClass"
        class="font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent"
      >
        {{ brandText }}
      </span>
    </div>
  `,
  styles: [`
    .animate-logo-pulse {
      animation: logo-pulse 3s ease-in-out infinite;
    }
    
    @keyframes logo-pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }
  `]
})
export class LogoComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showText: boolean = true;
  @Input() brandText: string = 'AdoptaCat';
  @Input() altText: string = 'AdoptaCat Chiclayo';
  @Input() animate: boolean = false;
  @Input() containerClass: string = '';

  get imageClass(): string {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24'
    };
    
    const animateClass = this.animate ? 'animate-logo-pulse' : '';
    
    return `${sizeClasses[this.size]} ${animateClass}`.trim();
  }

  get textClass(): string {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl'
    };
    
    return `${sizeClasses[this.size]} hidden sm:inline`;
  }
}