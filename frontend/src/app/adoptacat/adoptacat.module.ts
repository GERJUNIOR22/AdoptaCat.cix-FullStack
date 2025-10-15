import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdoptacatRoutingModule } from './adoptacat-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturedCatsComponent } from './components/featured-cats/featured-cats.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CatProfileComponent } from './pages/gatos/cat-profile/cat-profile.component';

@NgModule({
  declarations: [],
  // import CommonModule, routing and the standalone components so their selectors work
  imports: [
    CommonModule,
    RouterModule,
    AdoptacatRoutingModule,
    HomeComponent,
    HeroComponent,
    FeaturedCatsComponent,
    NavigationComponent,
    CatProfileComponent,
  ],
  exports: [],
})
export class AdoptacatModule {}
