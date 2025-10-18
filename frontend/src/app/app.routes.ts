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
    loadComponent: () => import('./features/home/pages/home.component').then(m => m.HomeComponent)
  },
  // Placeholder routes for future development
  {
    path: 'apadrina',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'blog',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'nosotros',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'donaciones',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
