import { Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'adopta/:id',
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
  },
  {
    path: 'perfil',
    loadComponent: () => import('./features/profile/pages/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'cats',
        loadComponent: () => import('./features/admin/cats/admin-cats.component').then(m => m.AdminCatsComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/admin/applications/admin-applications.component').then(m => m.AdminApplicationsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports/admin-reports.component').then(m => m.AdminReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/admin-settings.component').then(m => m.AdminSettingsComponent)
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/admin/blog/admin-blog.component').then(m => m.AdminBlogComponent)
      },
      {
        path: 'blog/new',
        loadComponent: () => import('./features/admin/blog/admin-blog-form.component').then(m => m.AdminBlogFormComponent)
      },
      {
        path: 'blog/edit/:id',
        loadComponent: () => import('./features/admin/blog/admin-blog-form.component').then(m => m.AdminBlogFormComponent)
      }
    ]
  }
];
