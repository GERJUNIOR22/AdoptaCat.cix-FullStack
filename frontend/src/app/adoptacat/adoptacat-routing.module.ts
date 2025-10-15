import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatProfileComponent } from './pages/gatos/cat-profile/cat-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'adopta', component: HomeComponent },
  { path: 'gatos/:id', component: CatProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptacatRoutingModule {}
