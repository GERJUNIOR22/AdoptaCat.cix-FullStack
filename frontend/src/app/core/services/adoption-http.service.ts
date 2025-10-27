import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdoptionApplication {
  id?: number;
  catId: string;
  applicationNumber?: string;
  
  // Información personal
  fullName: string;
  email: string;
  phone: string;
  age: number;
  occupation: string;
  
  // Información de vivienda
  address: string;
  city: string;
  houseType: 'apartment' | 'house' | 'other';
  hasYard: boolean;
  hasBalcony: boolean;
  livesAlone: boolean;
  householdMembers?: number;
  
  // Experiencia con mascotas
  hasCurrentPets: boolean;
  currentPetsDescription?: string;
  hasPreviousPets: boolean;
  previousPetsDescription?: string;
  
  // Información específica sobre adopción
  whyAdopt: string;
  experienceWithCats: string;
  
  // Cuidado y responsabilidades
  hasVetResources: boolean;
  preferredVet?: string;
  emergencyPlan: string;
  timeCommitment: string;
  
  // Condiciones especiales
  acceptsTerms: boolean;
  allowsVisits: boolean;
  
  // Estado de la solicitud
  status?: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

export interface AdoptionApplicationStatus {
  applicationNumber: string;
  status: string;
  catName: string;
  submittedAt: Date;
  lastUpdated: Date;
}

@Injectable({ providedIn: 'root' })
export class AdoptionHttpService {
  private readonly apiUrl = `${environment.apiUrl}/api/adoption-applications`;

  constructor(private http: HttpClient) {}

  // Crear nueva solicitud de adopción
  createApplication(application: AdoptionApplication): Observable<AdoptionApplication> {
    return this.http.post<AdoptionApplication>(this.apiUrl, application);
  }

  // Obtener solicitud por número de aplicación
  getApplicationByNumber(applicationNumber: string): Observable<AdoptionApplication> {
    return this.http.get<AdoptionApplication>(`${this.apiUrl}/number/${applicationNumber}`);
  }

  // Obtener solicitudes por email del usuario
  getApplicationsByEmail(email: string): Observable<AdoptionApplication[]> {
    return this.http.get<AdoptionApplication[]>(`${this.apiUrl}/user/${email}`);
  }

  // Verificar estado de solicitud
  checkApplicationStatus(applicationNumber: string): Observable<AdoptionApplicationStatus> {
    return this.http.get<AdoptionApplicationStatus>(`${this.apiUrl}/check/${applicationNumber}`);
  }

  // Cancelar solicitud de adopción
  cancelApplication(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Actualizar información de solicitud (antes de ser revisada)
  updateApplication(id: number, application: Partial<AdoptionApplication>): Observable<AdoptionApplication> {
    return this.http.put<AdoptionApplication>(`${this.apiUrl}/${id}`, application);
  }
}