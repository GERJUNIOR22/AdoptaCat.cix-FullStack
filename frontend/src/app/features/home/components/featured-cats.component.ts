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
    <section class="featured-cats py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Featured Cats</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let cat of displayCats" class="cat-card bg-white rounded-lg shadow-md p-4">
            <div class="cat-image bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
              <span class="text-gray-500">{{ cat.name }} Photo</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ cat.name }}</h3>
            <p class="text-gray-600 mb-2">{{ cat.breed }}</p>
            <p class="text-gray-600 mb-4">{{ cat.age }}</p>
            <button 
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              [routerLink]="['/cat', cat.id]">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .featured-cats {
      background-color: #f8f9fa;
    }
    .cat-card:hover {
      transform: translateY(-4px);
      transition: transform 0.2s ease-in-out;
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