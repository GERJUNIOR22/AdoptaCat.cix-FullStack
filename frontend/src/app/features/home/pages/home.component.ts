import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../../../layout/header/navigation.component';
import { HeroComponent } from '../components/hero.component';
import { FeaturedCatsComponent } from '../components/featured-cats.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent, HeroComponent, FeaturedCatsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}