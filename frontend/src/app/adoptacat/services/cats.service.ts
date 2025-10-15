import { Injectable } from '@angular/core';

export interface Cat {
  id: string;
  name: string;
  age?: string;
  breed?: string;
  image?: string;
  gallery?: string[];
  personality?: string;
  story?: string;
}

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
      image: 'assets/adoptacat/siamese-blue-eyes.png',
      gallery: [
        'assets/adoptacat/siamese-blue-eyes.png'
      ],
      personality: 'Tímido pero muy leal',
      story: 'Milo se adapta mejor con cuidados y rutinas suaves. Cuando confía, es muy afectuoso.'
    }
  ];

  getCats() {
    return this.cats;
  }

  getCatById(id?: string) {
    if (!id) return undefined;
    return this.cats.find((c) => c.id === id);
  }
}
