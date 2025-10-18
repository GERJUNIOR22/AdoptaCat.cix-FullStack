import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CatsService } from '../../../core/services/cats.service';
import { Cat } from '../../../shared/models/cat.model';
import { NavigationComponent } from '../../../layout/header/navigation.component';

@Component({
  selector: 'app-cat-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent],
  templateUrl: './cat-profile.component.html',
  styleUrls: ['./cat-profile.component.scss'],
})
export class CatProfileComponent implements OnInit {
  id?: string;
  cat?: Cat;
  otherCats: Cat[] = [];
  selectedImage?: string;

  constructor(private readonly route: ActivatedRoute, private readonly catsService: CatsService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) {
      this.cat = this.catsService.getCatById(this.id);
      this.otherCats = this.catsService.getCats().filter((c: Cat) => c.id !== this.id);
      this.selectedImage = this.cat?.gallery?.[0] || this.cat?.image;
    }
  }

  selectImage(src: string) {
    this.selectedImage = src;
  }
}