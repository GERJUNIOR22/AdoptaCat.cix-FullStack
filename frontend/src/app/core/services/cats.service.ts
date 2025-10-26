import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cat, DetailedCat } from '../../shared/models/cat.model';

@Injectable({ providedIn: 'root' })
export class CatsService {
  constructor() {}

  // Datos embebidos temporales que ahora usan imágenes reales
  private readonly cats: Cat[] = [
    {
      id: 'luna',
      name: 'Luna',
      age: '2 años',
      breed: 'Doméstico Pelo Corto',
      image: 'assets/gatos/miel.webp', // Imagen real
      gallery: ['assets/gatos/miel.webp'],
      personality: 'Cariñosa, tranquila y juguetona',
      story: 'Luna fue rescatada de la calle y busca un hogar lleno de cariño.',
      description: 'Una gata muy especial que ama jugar y recibir caricias.',
      isSpecialNeeds: false,
      vaccinated: true,
      sterilized: true,
      gender: 'female'
    },
    {
      id: 'oliver',
      name: 'Oliver',
      age: '3 años',
      breed: 'Atigrado',
      image: 'assets/gatos/milaneso.webp', // Imagen real
      gallery: ['assets/gatos/milaneso.webp'],
      personality: 'Curioso y social',
      story: 'Oliver es un gatito explorador que disfruta de las ventanas.',
      description: 'Un gato maduro y tranquilo, ideal para familias.',
      isSpecialNeeds: false,
      vaccinated: true,
      sterilized: true,
      gender: 'male'
    },
    {
      id: 'milo',
      name: 'Milo',
      age: '1 año',
      breed: 'Siamés mestizo',
      image: 'assets/gatos/gatofondo.webp', // Imagen real
      gallery: ['assets/gatos/gatofondo.webp'],
      personality: 'Energético y vocal',
      story: 'Milo es un gatito joven lleno de energía.',
      description: 'Un joven aventurero muy inteligente.',
      isSpecialNeeds: false,
      vaccinated: true,
      sterilized: true,
      gender: 'male'
    }
  ];

  // Métodos que devuelven observables (preparado para backend)
  getCats(): Observable<Cat[]> {
    return of(this.cats);
  }

  getCatById(id: string): Observable<Cat | undefined> {
    const cat = this.cats.find(cat => cat.id === id);
    return of(cat);
  }

  // Método para obtener detalles completos (futuro endpoint del backend)
  getCatDetails(id: string): Observable<DetailedCat | undefined> {
    return of(this.getDetailedCatData(id));
  }

  // Genera URLs de imágenes (cuando el backend esté listo)
  getImageUrl(relativePath: string): string {
    // Por ahora las imágenes están en assets, pero en el futuro
    // se construirá la URL completa del backend
    return relativePath;
  }

  // Datos detallados temporales
  private getDetailedCatData(id: string): DetailedCat | undefined {
    const baseCat = this.cats.find(cat => cat.id === id);
    if (!baseCat) return undefined;

    switch (id) {
      case 'luna':
        return {
          ...baseCat,
          mainImage: 'assets/gatos/miel.webp',
          gallery: ['assets/gatos/miel.webp'],
          personality: ['Muy Juguetona', 'Extremadamente Cariñosa', 'Sociable'],
          story: 'Hola, soy Luna 🌙 Una gatita de 2 años con mucha energía y amor para dar.',
          description: baseCat.description || 'Una gata muy especial que ama jugar.',
          characteristics: {
            birthDate: 'Marzo 2022',
            gender: 'Hembra',
            size: 'Mediano',
            activityLevel: 'Alto',
            healthStatus: 'Excelente',
            arrivedAt: 'Agosto 2024'
          },
          adoptionProcess: [
            { step: 1, title: 'Elige a tu gato y postula', description: '', color: '#c4b5fd' },
            { step: 2, title: 'Entrevista y visita', description: '', color: '#a78bfa' },
            { step: 3, title: 'Período de adaptación', description: '', color: '#8b5cf6' },
            { step: 4, title: '¡Adopción exitosa!', description: '', color: '#7c3aed' }
          ]
        };
      case 'oliver':
        return {
          ...baseCat,
          mainImage: 'assets/gatos/milaneso.webp',
          gallery: ['assets/gatos/milaneso.webp'],
          personality: ['Tranquilo y Gentil', 'Sociable', 'Cariñoso'],
          story: 'Hola, soy Oliver 🐱 Un gato atigrado de 3 años con mucha experiencia.',
          description: baseCat.description || 'Un gato atigrado muy tranquilo.',
          characteristics: {
            birthDate: 'Enero 2021',
            gender: 'Macho',
            size: 'Grande',
            activityLevel: 'Medio',
            healthStatus: 'Sano',
            arrivedAt: 'Septiembre 2024'
          },
          adoptionProcess: [
            { step: 1, title: 'Elige a tu gato y postula', description: '', color: '#c4b5fd' },
            { step: 2, title: 'Entrevista y visita', description: '', color: '#a78bfa' },
            { step: 3, title: 'Período de adaptación', description: '', color: '#8b5cf6' },
            { step: 4, title: '¡Adopción exitosa!', description: '', color: '#7c3aed' }
          ]
        };
      case 'milo':
        return {
          ...baseCat,
          mainImage: 'assets/gatos/gatofondo.webp',
          gallery: ['assets/gatos/gatofondo.webp'],
          personality: ['Muy Curioso', 'Aventurero', 'Inteligente'],
          story: 'Hola, soy Milo 🐾 Un joven siamés mestizo lleno de curiosidad.',
          description: baseCat.description || 'Un joven aventurero muy inteligente.',
          characteristics: {
            birthDate: 'Octubre 2023',
            gender: 'Macho',
            size: 'Mediano',
            activityLevel: 'Muy Alto',
            healthStatus: 'Excelente',
            arrivedAt: 'Julio 2024'
          },
          adoptionProcess: [
            { step: 1, title: 'Elige a tu gato y postula', description: '', color: '#c4b5fd' },
            { step: 2, title: 'Entrevista y visita', description: '', color: '#a78bfa' },
            { step: 3, title: 'Período de adaptación', description: '', color: '#8b5cf6' },
            { step: 4, title: '¡Adopción exitosa!', description: '', color: '#7c3aed' }
          ]
        };
      default:
        return undefined;
    }
  }
}