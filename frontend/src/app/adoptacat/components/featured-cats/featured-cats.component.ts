import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatsService, Cat } from '../../services/cats.service';

@Component({
  selector: 'app-adoptacat-featured-cats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-cats.component.html',
  styleUrls: ['./featured-cats.component.scss'],
})
export class FeaturedCatsComponent implements OnInit {
  @Input() limit?: number;

  cats: Cat[] = [
    { id: 'luna', name: 'Luna', age: '2 años', breed: 'Doméstico Pelo Corto', image: 'assets/adoptacat/black-cat-with-yellow-eyes.jpg' },
    { id: 'oliver', name: 'Oliver', age: '3 años', breed: 'Atigrado', image: 'assets/adoptacat/orange-tabby-cat-lounging.jpg' },
    { id: 'milo', name: 'Milo', age: '1 año', breed: 'Siamés Mestizo', image: 'assets/adoptacat/siamese-blue-eyes.png' },
  ];

  constructor(private catsService: CatsService) {}

  ngOnInit(): void {
    this.cats = this.catsService.getCats();
  }

  get displayCats() {
    return this.limit ? this.cats.slice(0, this.limit) : this.cats;
  }
}
