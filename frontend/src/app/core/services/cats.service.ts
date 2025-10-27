import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cat, DetailedCat } from '../../shared/models/cat.model';
import { CatsHttpService } from './cats-http.service';

@Injectable({ providedIn: 'root' })
export class CatsService {
  // Datos de fallback en caso de que el backend no esté disponible
  private readonly fallbackCats: Cat[] = [
    {
      id: 'luna',
      name: 'Luna',
      age: '2 años',
      breed: 'Doméstico Pelo Corto',
      image: 'assets/gatos/miel.webp',
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
      image: 'assets/gatos/milaneso.webp',
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
      image: 'assets/gatos/gatofondo.webp',
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

  constructor(private catsHttpService: CatsHttpService) {}

  // Obtener todos los gatos (intenta backend, fallback a datos locales)
  getCats(): Observable<Cat[]> {
    return this.catsHttpService.getAllAvailableCats().pipe(
      catchError(error => {
        console.warn('Backend no disponible, usando datos de fallback:', error);
        return of(this.fallbackCats);
      })
    );
  }

  // Obtener gato por ID
  getCatById(id: string): Observable<Cat | undefined> {
    return this.catsHttpService.getAvailableCatById(id).pipe(
      catchError(error => {
        console.warn('Backend no disponible para gato individual, usando datos de fallback:', error);
        const cat = this.fallbackCats.find(cat => cat.id === id);
        return of(cat);
      })
    );
  }

  // Obtener detalles completos del gato
  getCatDetails(id: string): Observable<DetailedCat | undefined> {
    return this.catsHttpService.getCatDetails(id).pipe(
      catchError(error => {
        console.warn('Backend no disponible para detalles, usando datos de fallback:', error);
        return of(this.getDetailedCatDataFallback(id));
      })
    );
  }

  // Obtener gatos destacados
  getFeaturedCats(): Observable<Cat[]> {
    return this.catsHttpService.getFeaturedCats().pipe(
      catchError(error => {
        console.warn('Backend no disponible para destacados, usando datos de fallback:', error);
        // Retornar algunos gatos como destacados
        return of(this.fallbackCats.slice(0, 2));
      })
    );
  }

  // Buscar gatos por nombre
  searchCatsByName(name: string): Observable<Cat[]> {
    return this.catsHttpService.searchCatsByName(name).pipe(
      catchError(error => {
        console.warn('Backend no disponible para búsqueda, usando datos de fallback:', error);
        const filtered = this.fallbackCats.filter(cat => 
          cat.name.toLowerCase().includes(name.toLowerCase())
        );
        return of(filtered);
      })
    );
  }

  // Generar URL de imagen
  getImageUrl(relativePath: string): string {
    // Si la ruta ya es completa, la devolvemos tal como está
    if (relativePath.startsWith('http') || relativePath.startsWith('assets/')) {
      return relativePath;
    }
    // Si es una ruta del backend, la construimos
    return `${this.catsHttpService['apiUrl']}/images/${relativePath}`;
  }

  // Datos detallados de fallback
  private getDetailedCatDataFallback(id: string): DetailedCat | undefined {
    const baseCat = this.fallbackCats.find(cat => cat.id === id);
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