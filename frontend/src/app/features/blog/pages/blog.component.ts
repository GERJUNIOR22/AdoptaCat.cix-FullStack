import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
  tags: string[];
}

interface BlogCategory {
  id: string;
  name: string;
  count: number;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white py-20">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-4xl mx-auto">
            <h1 class="text-5xl font-bold mb-6">Blog</h1>
            <p class="text-xl text-purple-100">
              Consejos, historias y noticias sobre el cuidado de gatos
            </p>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <!-- Contenido Principal -->
          <div class="lg:col-span-3">
            <!-- Filtros de categorías -->
            <div class="mb-8">
              <div class="flex flex-wrap gap-3">
                <button 
                  *ngFor="let category of categories"
                  (click)="setActiveCategory(category.id)"
                  [class]="activeCategory() === category.id ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
                  class="px-4 py-2 rounded-full border border-gray-200 font-medium transition-colors">
                  {{ category.name }} ({{ category.count }})
                </button>
              </div>
            </div>

            <!-- Posts Destacados -->
            <div class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                Posts Destacados
                <a href="#" class="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                  Ver todos 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </a>
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div *ngFor="let post of featuredPosts" class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div [class]="post.image" class="h-48 bg-cover bg-center relative">
                    <div class="absolute top-4 left-4">
                      <span class="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {{ post.category }}
                      </span>
                    </div>
                  </div>
                  <div class="p-6">
                    <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                      {{ post.date }}
                      <span class="mx-2">•</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                      {{ post.readTime }}
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{{ post.title }}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ post.excerpt }}</p>
                    <button class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                      Leer más
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grid de Artículos -->
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Todos los Artículos</h2>
              <div class="space-y-8">
                <article *ngFor="let post of filteredPosts()" class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div class="md:flex">
                    <div class="md:w-1/3">
                      <div [class]="post.image" class="h-48 md:h-full bg-cover bg-center"></div>
                    </div>
                    <div class="md:w-2/3 p-8">
                      <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                          {{ post.category }}
                        </span>
                        <span class="mx-2">•</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        {{ post.date }}
                        <span class="mx-2">•</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                        {{ post.readTime }}
                      </div>
                      <h2 class="text-2xl font-bold text-gray-900 mb-3">{{ post.title }}</h2>
                      <p class="text-gray-600 mb-4 leading-relaxed">{{ post.excerpt }}</p>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <span class="text-white text-sm font-medium">{{ post.author.charAt(0) }}</span>
                          </div>
                          <span class="text-sm text-gray-700 font-medium">{{ post.author }}</span>
                        </div>
                        <button class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                          Leer más
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <!-- Paginación -->
              <div class="flex justify-center mt-12">
                <div class="flex items-center gap-2">
                  <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                    ← Anterior
                  </button>
                  <button class="px-4 py-2 bg-purple-600 text-white rounded-lg">1</button>
                  <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">2</button>
                  <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">3</button>
                  <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="space-y-8">
              <!-- Búsqueda -->
              <div class="bg-white rounded-2xl p-6 shadow-lg">
                <h3 class="font-bold text-gray-900 mb-4">Buscar artículos</h3>
                <div class="relative">
                  <input 
                    type="text" 
                    placeholder="¿Qué buscas?"
                    class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </button>
                </div>
              </div>

              <!-- Artículos Populares -->
              <div class="bg-white rounded-2xl p-6 shadow-lg">
                <h3 class="font-bold text-gray-900 mb-4">Artículos Populares</h3>
                <div class="space-y-4">
                  <div *ngFor="let post of popularPosts" class="flex gap-3">
                    <div [class]="post.image" class="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0"></div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 text-sm line-clamp-2">{{ post.title }}</h4>
                      <p class="text-xs text-gray-500 mt-1">{{ post.date }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Newsletter -->
              <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
                <h3 class="font-bold mb-3">¡Mantente informado!</h3>
                <p class="text-purple-100 text-sm mb-4">
                  Recibe los mejores consejos sobre gatos directamente en tu email.
                </p>
                <div class="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Tu correo electrónico"
                    class="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300">
                  <button class="w-full bg-white text-purple-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Suscribirse
                  </button>
                </div>
              </div>

              <!-- Tags -->
              <div class="bg-white rounded-2xl p-6 shadow-lg">
                <h3 class="font-bold text-gray-900 mb-4">Tags Populares</h3>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let tag of popularTags" 
                        class="bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Recursos Útiles -->
              <div class="bg-white rounded-2xl p-6 shadow-lg">
                <h3 class="font-bold text-gray-900 mb-4">Recursos Útiles</h3>
                <div class="space-y-3">
                  <a href="#" class="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
                    Guía de adopción
                  </a>
                  <a href="#" class="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
                    Donar alimento
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .bg-blog-1 { 
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), 
                  url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="30" cy="40" r="15" fill="%23f97316"/><rect x="20" y="60" width="60" height="30" rx="5" fill="%2364748b"/></svg>') center/cover,
                  linear-gradient(45deg, #f97316, #ea580c);
    }
    
    .bg-blog-2 { 
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), 
                  url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="40" r="15" fill="%23f59e0b"/><path d="M30 60 Q50 40 70 60 L70 80 L30 80 Z" fill="%2306b6d4"/></svg>') center/cover,
                  linear-gradient(45deg, #06b6d4, #0891b2);
    }
    
    .bg-blog-3 { 
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), 
                  url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="30" cy="30" r="12" fill="%23f59e0b"/><circle cx="70" cy="50" r="18" fill="%2384cc16"/></svg>') center/cover,
                  linear-gradient(45deg, #84cc16, #65a30d);
    }

    .bg-blog-4 { 
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), 
                  linear-gradient(45deg, #8b5cf6, #7c3aed);
    }
    
    .bg-blog-5 { 
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), 
                  linear-gradient(45deg, #ef4444, #dc2626);
    }
    
    .bg-blog-6 { 
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), 
                  linear-gradient(45deg, #10b981, #059669);
    }

    .bg-blog-7 { 
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), 
                  linear-gradient(45deg, #f59e0b, #d97706);
    }

    .bg-blog-8 { 
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), 
                  linear-gradient(45deg, #6366f1, #4f46e5);
    }
  `]
})
export class BlogComponent {
  public activeCategory = signal<string>('all');

  public categories: BlogCategory[] = [
    { id: 'all', name: 'Todos', count: 15 },
    { id: 'cuidado', name: 'Cuidado', count: 6 },
    { id: 'salud', name: 'Salud', count: 4 },
    { id: 'historias', name: 'Historias', count: 3 },
    { id: 'consejos', name: 'Consejos', count: 2 }
  ];

  public featuredPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Cómo preparar tu hogar para un nuevo gato',
      excerpt: 'Consejos esenciales para crear un espacio seguro y acogedor para tu nuevo compañero felino.',
      content: '',
      date: '15 Marzo 2024',
      author: 'Dr. Ana García',
      category: 'Cuidado',
      image: 'bg-blog-1',
      readTime: '5 min',
      tags: ['preparación', 'hogar', 'nuevo gato']
    },
    {
      id: 2,
      title: 'La importancia de la esterilización',
      excerpt: 'Descubre por qué la esterilización es crucial para la salud y bienestar de tu gato.',
      content: '',
      date: '10 Marzo 2024',
      author: 'Dra. María López',
      category: 'Salud',
      image: 'bg-blog-2',
      readTime: '7 min',
      tags: ['esterilización', 'salud', 'prevención']
    },
    {
      id: 3,
      title: 'Historias de adopción exitosas',
      excerpt: 'Conoce las historias inspiradoras de gatos que encontraron su hogar perfecto.',
      content: '',
      date: '5 Marzo 2024',
      author: 'Carlos Mendoza',
      category: 'Historias',
      image: 'bg-blog-3',
      readTime: '4 min',
      tags: ['adopción', 'historias', 'éxito']
    }
  ];

  public allPosts: BlogPost[] = [
    ...this.featuredPosts,
    {
      id: 4,
      title: 'Alimentación adecuada para gatos adultos',
      excerpt: 'Guía completa sobre los nutrientes esenciales que necesita tu gato adulto para mantenerse saludable y lleno de energía.',
      content: '',
      date: '28 Febrero 2024',
      author: 'Dr. Pedro Ruiz',
      category: 'Cuidado',
      image: 'bg-blog-4',
      readTime: '6 min',
      tags: ['alimentación', 'nutrición', 'salud']
    },
    {
      id: 5,
      title: 'Señales de enfermedad en gatos',
      excerpt: 'Aprende a identificar los síntomas tempranos que podrían indicar problemas de salud en tu compañero felino.',
      content: '',
      date: '22 Febrero 2024',
      author: 'Dra. Laura Sánchez',
      category: 'Salud',
      image: 'bg-blog-5',
      readTime: '8 min',
      tags: ['salud', 'síntomas', 'prevención']
    },
    {
      id: 6,
      title: 'La historia de Mochi: De la calle al hogar',
      excerpt: 'La emotiva historia de Mochi, un gato callejero que encontró una segunda oportunidad gracias a una familia amorosa.',
      content: '',
      date: '18 Febrero 2024',
      author: 'Ana Jiménez',
      category: 'Historias',
      image: 'bg-blog-6',
      readTime: '5 min',
      tags: ['rescate', 'adopción', 'segunda oportunidad']
    },
    {
      id: 7,
      title: 'Juguetes caseros para entretener a tu gato',
      excerpt: 'Ideas creativas y económicas para mantener a tu gato activo y entretenido con materiales que tienes en casa.',
      content: '',
      date: '12 Febrero 2024',
      author: 'Roberto Torres',
      category: 'Consejos',
      image: 'bg-blog-7',
      readTime: '4 min',
      tags: ['juguetes', 'DIY', 'entretenimiento']
    },
    {
      id: 8,
      title: 'Socialización temprana en gatitos',
      excerpt: 'Por qué es crucial exponer a los gatitos a diferentes experiencias durante sus primeras semanas de vida.',
      content: '',
      date: '8 Febrero 2024',
      author: 'Dra. Carmen Vega',
      category: 'Cuidado',
      image: 'bg-blog-8',
      readTime: '6 min',
      tags: ['socialización', 'gatitos', 'comportamiento']
    }
  ];

  public popularPosts: BlogPost[] = [
    this.allPosts[0],
    this.allPosts[1],
    this.allPosts[3],
    this.allPosts[4]
  ];

  public popularTags: string[] = [
    'adopción', 'salud', 'cuidado', 'alimentación', 'comportamiento', 
    'gatitos', 'esterilización', 'vacunación', 'juguetes', 'socialización'
  ];

  public setActiveCategory(categoryId: string): void {
    this.activeCategory.set(categoryId);
  }

  public filteredPosts(): BlogPost[] {
    if (this.activeCategory() === 'all') {
      return this.allPosts;
    }
    return this.allPosts.filter(post => 
      post.category.toLowerCase() === this.activeCategory()
    );
  }
}