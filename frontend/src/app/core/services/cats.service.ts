import { Injectable } from '@angular/core';
import { Cat } from '../../shared/models/cat.model';

@Injectable({ providedIn: 'root' })
export class CatsService {
  constructor() {}

  // Datos embebidos tomados del repo original (subset para demo)
  private cats: Cat[] = [
    {
      id: 'luna',
      name: 'Luna',
      age: '2 años',
      breed: 'Doméstico Pelo Corto',
      image: 'assets/adoptacat/black-cat-with-yellow-eyes.jpg',
      gallery: [
        'assets/adoptacat/black-cat-with-yellow-eyes.jpg',
        'assets/adoptacat/gray-cat-with-green-eyes.jpg',
      ],
      personality: 'Cariñosa, tranquila y juguetona',
      story: 'Luna fue rescatada de la calle y busca un hogar lleno de cariño. Le encanta jugar con pelotas y dormir al sol.'
    },
    {
      id: 'oliver',
      name: 'Oliver',
      age: '3 años',
      breed: 'Atigrado',
      image: 'assets/adoptacat/orange-tabby-cat-lounging.jpg',
      gallery: [
        'assets/adoptacat/orange-tabby-cat-lounging.jpg',
        'assets/adoptacat/orange-tabby-cat-sitting.jpg'
      ],
      personality: 'Curioso y social',
      story: 'Oliver es un gatito explorador que disfruta de las ventanas y las siestas al mediodía.'
    },
    {
      id: 'milo',
      name: 'Milo',
      age: '1 año',
      breed: 'Siamés mestizo',
      image: 'assets/adoptacat/siamese-mix-kitten.jpg',
      personality: 'Energético y vocal',
      story: 'Milo es un gatito joven lleno de energía que busca una familia activa que pueda seguir su ritmo.'
    },
    {
      id: 'bella',
      name: 'Bella',
      age: '4 años',
      breed: 'Persa',
      image: 'assets/adoptacat/persian-cat-fluffy.jpg',
      personality: 'Elegante y relajada',
      story: 'Bella es una gata elegante que prefiere ambientes tranquilos. Es perfecta para personas que buscan compañía serena.'
    }
  ];

  getCats(): Cat[] {
    return this.cats;
  }

  getCatById(id: string | undefined): Cat | undefined {
    if (!id) return undefined;
    return this.cats.find(cat => cat.id === id);
  }
}