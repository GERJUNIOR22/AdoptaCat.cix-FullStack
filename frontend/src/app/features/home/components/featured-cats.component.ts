import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatsService } from '../../../core/services/cats.service';
import { Cat } from '../../../shared/models/cat.model';

@Component({
  selector: 'app-featured-cats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-cats.component.html',
  styleUrls: ['./featured-cats.component.scss'],
})
export class FeaturedCatsComponent implements OnInit {
  @Input() limit?: number;

  cats: Cat[] = [];

  constructor(private catsService: CatsService) {}

  ngOnInit(): void {
    this.cats = this.catsService.getCats();
  }

  get displayCats() {
    return this.limit ? this.cats.slice(0, this.limit) : this.cats;
  }
}