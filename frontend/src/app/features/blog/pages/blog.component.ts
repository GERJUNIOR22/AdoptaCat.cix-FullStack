import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BlogService, BlogPost } from '../../../core/services/blog.service';
import { PageResponse } from '../../../core/services/admin.service';

interface BlogCategory {
  id: string;
  name: string;
  value: string; // Backend enum value
  count: number;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
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
  `]
})
export class BlogComponent implements OnInit {
  private titleService = inject(Title);
  private blogService = inject(BlogService);

  public activeCategory = signal<string>('all');
  public posts = signal<BlogPost[]>([]);
  public featuredPosts = signal<BlogPost[]>([]);
  public loading = signal<boolean>(true);
  public currentPage = 0;
  public totalPages = 0;

  public categories: BlogCategory[] = [
    { id: 'all', name: 'Todos', value: '', count: 0 },
    { id: 'cuidado', name: 'Cuidado', value: 'CAT_CARE', count: 0 },
    { id: 'salud', name: 'Salud', value: 'OTHER', count: 0 },
    { id: 'historias', name: 'Historias', value: 'ADOPTION_STORIES', count: 0 },
    { id: 'consejos', name: 'Consejos', value: 'EDUCATION', count: 0 },
    { id: 'noticias', name: 'Noticias', value: 'NEWS', count: 0 },
    { id: 'eventos', name: 'Eventos', value: 'EVENTS', count: 0 }
  ];

  ngOnInit(): void {
    this.titleService.setTitle('Blog | AdopCat');
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    this.blogService.getPublishedPosts(this.currentPage, 10).subscribe({
      next: (response) => {
        this.posts.set(response.content);
        this.featuredPosts.set(response.content.filter(p => p.isFeatured).slice(0, 3));
        if (this.featuredPosts().length === 0) {
          this.featuredPosts.set(response.content.slice(0, 3));
        }
        this.totalPages = response.totalPages;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading posts', err);
        this.loading.set(false);
      }
    });
  }

  public setActiveCategory(categoryId: string): void {
    this.activeCategory.set(categoryId);
  }

  public filteredPosts(): BlogPost[] {
    const activeId = this.activeCategory();
    if (activeId === 'all') {
      return this.posts();
    }
    const categoryObj = this.categories.find(c => c.id === activeId);
    if (!categoryObj) return this.posts();

    return this.posts().filter(post =>
      post.category === categoryObj.value
    );
  }

  // Helpers for template
  getPostImage(post: BlogPost): string {
    return post.featuredImageUrl || 'assets/images/placeholder-cat.jpg'; // Fallback image
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getAuthorInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getCategoryName(categoryValue: string): string {
    const cat = this.categories.find(c => c.value === categoryValue);
    return cat ? cat.name : categoryValue;
  }
}