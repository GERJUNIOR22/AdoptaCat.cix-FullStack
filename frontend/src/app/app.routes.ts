import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'gatos/:id',
    loadComponent: () => import('./features/adoption/pages/cat-profile.component').then(m => m.CatProfileComponent)
  },
  {
    path: 'adopta',
    loadComponent: () => import('./features/adoption/pages/adoption.component').then(m => m.AdoptionComponent)
  },
  {
    path: 'apadrina',
    loadComponent: () => import('./features/sponsor/pages/sponsor.component').then(m => m.SponsorComponent)
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/pages/blog.component').then(m => m.BlogComponent)
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./features/about/pages/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'donaciones',
    loadComponent: () => import('./features/donations/pages/donations.component').then(m => m.DonationsComponent)
  }
];
