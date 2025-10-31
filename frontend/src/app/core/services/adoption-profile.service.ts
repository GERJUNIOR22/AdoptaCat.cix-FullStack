import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdoptionProfileData {
  // Información del Candidato
  nombreCompleto: string;
  celular: string;
  fechaNacimiento?: string;
  ciudad?: string;
  dni: string;
  estadoCivil: string;
  direccion: string;
  distrito: string;
  ocupacion?: string;
  correoElectronico: string;
  instagram?: string;
  facebook?: string;

  // PARTE 1: EXPERIENCIA CON MASCOTAS
  porqueAdoptar: string;
  tieneMascotasActuales: boolean;
  cualesMascotasActuales?: string;
  mascotasEsterilizadas?: boolean;
  porqueNoEsterilizadas?: string;
  tuvoMascotasAntes: boolean;
  cualesMascotasAntes?: string;
  quePasoConEllas?: string;

  // PARTE 2: HOGAR
  hayNinos: boolean;
  edadesNinos?: string;
  cuantasPersonasCasa: number;
  todosAcuerdan: boolean;
  alguienAlergico: boolean;
  permitenArrendadores?: boolean;
  porqueCambiarDomicilio: string;
  rupturaFamilia: string;

  // PARTE 3: RECREACIÓN Y PROYECCIÓN
  espacioSuficiente: boolean;
  areasIngresoGato: string;
  dondeDuermeGato: string;
  espaciosEscape: boolean;
  comportamientoGato: string;

  // PARTE 4: CUIDADOS Y GASTOS
  responsableGastos: string;
  cuidados: {
    visitasVeterinario: boolean;
    vacunacionVitaminas: boolean;
    placaIdentificacion: boolean;
    aguaLimpia: boolean;
    desparasitacion: boolean;
    cepilladoPelo: boolean;
    limpiezaArenero: boolean;
    alimentacionCroquetas: boolean;
  };
  recursosVeterinarios: boolean;
  compromisoEsterilizar: boolean;
  acuerdoVisitaDomiciliaria: boolean;

  // Aceptación
  aceptoCondiciones: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class AdoptionProfileService {
  private readonly baseUrl = 'http://localhost:8080/api/adoption-profiles';
  private readonly http = inject(HttpClient);

  /**
   * Crear o actualizar perfil de adopción
   */
  createOrUpdateProfile(profileData: AdoptionProfileData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.baseUrl, profileData);
  }

  /**
   * Obtener perfil por email
   */
  getProfileByEmail(email: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/by-email/${email}`);
  }

  /**
   * Verificar si existe perfil
   */
  checkProfileExists(email: string): Observable<ApiResponse<{exists: boolean}>> {
    return this.http.get<ApiResponse<{exists: boolean}>>(`${this.baseUrl}/exists/${email}`);
  }

  /**
   * Obtener perfil por ID
   */
  getProfileById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtener todos los perfiles
   */
  getAllProfiles(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(this.baseUrl);
  }

  /**
   * Obtener perfiles por status
   */
  getProfilesByStatus(status: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/status/${status}`);
  }

  /**
   * Obtener estadísticas
   */
  getProfileStatistics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/statistics`);
  }
}