import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cat, DetailedCat } from '../../shared/models/cat.model';
import { environment } from '../../../environments/environment';

export interface CatFilters {
  gender?: 'male' | 'female';
  size?: 'small' | 'medium' | 'large';
  activityLevel?: 'low' | 'medium' | 'high';
  isSpecialNeeds?: boolean;
  isVaccinated?: boolean;
  isSterilized?: boolean;
  page?: number;
<<<<<<< HEAD
  size?: number;
=======
  pageSize?: number;
>>>>>>> develop
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CatStats {
  availableCats: number;
  adoptedCats: number;
  pendingCats: number;
  totalCats: number;
}

@Injectable({ providedIn: 'root' })
export class CatsHttpService {
  private readonly apiUrl = `${environment.apiUrl}/api/cats`;

<<<<<<< HEAD
  constructor(private http: HttpClient) {}
=======
  constructor(private http: HttpClient) { }
>>>>>>> develop

  // Obtener todos los gatos disponibles
  getAllAvailableCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${this.apiUrl}/available`);
  }

  // Obtener gatos con paginación
  getAvailableCats(page: number = 0, size: number = 10, sortBy: string = 'name', sortDirection: string = 'asc'): Observable<PagedResponse<Cat>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<PagedResponse<Cat>>(this.apiUrl, { params });
  }

  // Obtener gato por ID
  getCatById(id: string): Observable<Cat> {
    return this.http.get<Cat>(`${this.apiUrl}/${id}`);
  }

  // Obtener gato disponible por ID
  getAvailableCatById(id: string): Observable<Cat> {
    return this.http.get<Cat>(`${this.apiUrl}/available/${id}`);
  }

  // Obtener gatos destacados
  getFeaturedCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${this.apiUrl}/featured`);
  }

  // Obtener gatos recién llegados
  getRecentArrivals(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${this.apiUrl}/recent-arrivals`);
  }

  // Buscar gatos por nombre
  searchCatsByName(name: string): Observable<Cat[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Cat[]>(`${this.apiUrl}/search`, { params });
  }

  // Buscar gatos por raza
  searchCatsByBreed(breed: string): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${this.apiUrl}/breed/${breed}`);
  }

  // Buscar gatos con filtros avanzados
  searchCatsWithFilters(filters: CatFilters): Observable<PagedResponse<Cat>> {
    let params = new HttpParams();
<<<<<<< HEAD
    
=======

>>>>>>> develop
    if (filters.gender) params = params.set('gender', filters.gender.toUpperCase());
    if (filters.size) params = params.set('size', filters.size.toUpperCase());
    if (filters.activityLevel) params = params.set('activityLevel', filters.activityLevel.toUpperCase());
    if (filters.isSpecialNeeds !== undefined) params = params.set('isSpecialNeeds', filters.isSpecialNeeds.toString());
    if (filters.isVaccinated !== undefined) params = params.set('isVaccinated', filters.isVaccinated.toString());
    if (filters.isSterilized !== undefined) params = params.set('isSterilized', filters.isSterilized.toString());
    if (filters.page !== undefined) params = params.set('page', filters.page.toString());
<<<<<<< HEAD
    if (filters.size !== undefined) params = params.set('size', filters.size.toString());
=======
    if (filters.pageSize !== undefined) params = params.set('size', filters.pageSize.toString());
>>>>>>> develop
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortDirection) params = params.set('sortDirection', filters.sortDirection);

    return this.http.get<PagedResponse<Cat>>(`${this.apiUrl}/filter`, { params });
  }

  // Obtener estadísticas de gatos
  getCatStats(): Observable<CatStats> {
    return this.http.get<CatStats>(`${this.apiUrl}/stats`);
  }

  // Verificar si existe un gato
  checkCatExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/exists`);
  }

  // Mapear datos del backend al formato del frontend
  private mapToDetailedCat(cat: Cat): DetailedCat {
    return {
      ...cat,
      mainImage: cat.image || 'assets/gatos/default.webp',
      gallery: cat.gallery || [cat.image || 'assets/gatos/default.webp'],
      personality: Array.isArray(cat.personality) ? cat.personality : [cat.personality || 'Amigable'],
      story: cat.story || 'Un gato especial buscando hogar.',
      description: cat.description || 'Un compañero maravilloso.',
      characteristics: {
<<<<<<< HEAD
        birthDate: cat.age || 'Desconocido',
=======
        birthDate: cat.age?.toString() || 'Desconocido',
>>>>>>> develop
        gender: cat.gender === 'female' ? 'Hembra' : 'Macho',
        size: 'Mediano',
        activityLevel: 'Medio',
        healthStatus: cat.vaccinated && cat.sterilized ? 'Excelente' : 'Bueno',
        arrivedAt: 'Recientemente'
      },
      adoptionProcess: [
        { step: 1, title: 'Elige a tu gato y postula', description: 'Completa la solicitud de adopción', color: '#c4b5fd' },
        { step: 2, title: 'Entrevista y visita', description: 'Conoce a tu futuro compañero', color: '#a78bfa' },
        { step: 3, title: 'Período de adaptación', description: 'Tiempo de prueba en casa', color: '#8b5cf6' },
        { step: 4, title: '¡Adopción exitosa!', description: 'Bienvenido a la familia', color: '#7c3aed' }
      ]
    };
  }

  // Método para obtener detalles completos (convierte Cat a DetailedCat)
  getCatDetails(id: string): Observable<DetailedCat | undefined> {
    return this.getAvailableCatById(id).pipe(
      map(cat => cat ? this.mapToDetailedCat(cat) : undefined)
    );
  }
}