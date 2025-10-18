import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <h1>Welcome to AdoptaCat</h1>
      <p>Find your perfect feline companion</p>
    </section>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      color: #666;
    }
  `]
})
export class HeroComponent {

}