import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reportes y Analytics</h1>
        <p class="mt-2 text-sm text-gray-700">Genera reportes y visualiza estadísticas del sistema</p>
      </div>

      <!-- Quick Reports -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Reporte de Gatos</dt>
                  <dd class="text-lg font-medium text-gray-900">Excel completo</dd>
                </dl>
              </div>
            </div>
            <div class="mt-5">
              <button type="button" 
                      (click)="generateCatsReport()"
                      [disabled]="generatingReport()"
                      class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg *ngIf="generatingReport()" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generar Reporte
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Reporte de Adopciones</dt>
                  <dd class="text-lg font-medium text-gray-900">Mensual</dd>
                </dl>
              </div>
            </div>
            <div class="mt-5">
              <button type="button" 
                      (click)="generateAdoptionsReport()"
                      [disabled]="generatingReport()"
                      class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg *ngIf="generatingReport()" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generar Reporte
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Reporte de Usuarios</dt>
                  <dd class="text-lg font-medium text-gray-900">Completo</dd>
                </dl>
              </div>
            </div>
            <div class="mt-5">
              <button type="button" 
                      (click)="generateUsersReport()"
                      [disabled]="generatingReport()"
                      class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg *ngIf="generatingReport()" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Report Generator -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Generador de Reportes Personalizados</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-4">Parámetros del Reporte</h4>
              <div class="space-y-4">
                <div>
                  <label for="report-type" class="block text-sm font-medium text-gray-700">Tipo de Reporte</label>
                  <select id="report-type" 
                          [(ngModel)]="customReport.type"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                    <option value="">Selecciona un tipo</option>
                    <option value="cats">Gatos</option>
                    <option value="applications">Solicitudes de Adopción</option>
                    <option value="users">Usuarios</option>
                    <option value="analytics">Analytics Completo</option>
                  </select>
                </div>

                <div>
                  <label for="date-from" class="block text-sm font-medium text-gray-700">Fecha desde</label>
                  <input type="date" 
                         id="date-from"
                         [(ngModel)]="customReport.dateFrom"
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                </div>

                <div>
                  <label for="date-to" class="block text-sm font-medium text-gray-700">Fecha hasta</label>
                  <input type="date" 
                         id="date-to"
                         [(ngModel)]="customReport.dateTo"
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                </div>

                <div>
                  <label for="format" class="block text-sm font-medium text-gray-700">Formato</label>
                  <select id="format" 
                          [(ngModel)]="customReport.format"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-4">Campos a Incluir</h4>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <label class="flex items-center">
                  <input type="checkbox" 
                         [(ngModel)]="customReport.includeBasicInfo"
                         class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
                  <span class="ml-2 text-sm text-gray-700">Información básica</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" 
                         [(ngModel)]="customReport.includeContactInfo"
                         class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
                  <span class="ml-2 text-sm text-gray-700">Información de contacto</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" 
                         [(ngModel)]="customReport.includeTimestamps"
                         class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
                  <span class="ml-2 text-sm text-gray-700">Fechas y timestamps</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" 
                         [(ngModel)]="customReport.includeStats"
                         class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
                  <span class="ml-2 text-sm text-gray-700">Estadísticas</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" 
                         [(ngModel)]="customReport.includeCharts"
                         class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
                  <span class="ml-2 text-sm text-gray-700">Gráficos y visualizaciones</span>
                </label>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" 
                    (click)="resetCustomReport()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Limpiar
            </button>
            <button type="button" 
                    (click)="generateCustomReport()"
                    [disabled]="!isCustomReportValid() || generatingReport()"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg *ngIf="generatingReport()" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generar Reporte Personalizado
            </button>
          </div>
        </div>
      </div>

      <!-- Analytics Dashboard -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Analytics del Sistema</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Adoption Trends -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Tendencias de Adopción (Últimos 6 meses)</h4>
              <div class="h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <p class="text-gray-500 text-sm">Gráfico de tendencias</p>
              </div>
            </div>

            <!-- Cat Status Distribution -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Distribución de Estados de Gatos</h4>
              <div class="h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <p class="text-gray-500 text-sm">Gráfico circular</p>
              </div>
            </div>

            <!-- User Growth -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Crecimiento de Usuarios</h4>
              <div class="h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <p class="text-gray-500 text-sm">Gráfico de barras</p>
              </div>
            </div>

            <!-- Application Success Rate -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Tasa de Éxito de Solicitudes</h4>
              <div class="h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <p class="text-gray-500 text-sm">Gráfico de progreso</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Reportes Generados Recientemente</h3>
        </div>
        <div class="p-6">
          <div class="flow-root">
            <ul role="list" class="-my-5 divide-y divide-gray-200">
              <li *ngFor="let report of recentReports" class="py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ report.name }}</p>
                    <p class="text-sm text-gray-500">{{ report.type }} • {{ formatDate(report.createdAt) }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <button type="button" 
                            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-rose-700 bg-rose-100 hover:bg-rose-200">
                      Descargar
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminReportsComponent {
  generatingReport = signal(false);

  customReport = {
    type: '',
    dateFrom: '',
    dateTo: '',
    format: 'excel',
    includeBasicInfo: true,
    includeContactInfo: false,
    includeTimestamps: true,
    includeStats: true,
    includeCharts: false
  };

  recentReports = [
    {
      name: 'Reporte de Gatos - Diciembre 2023',
      type: 'Excel',
      createdAt: '2023-12-15T10:30:00Z'
    },
    {
      name: 'Análisis de Adopciones - Noviembre 2023',
      type: 'PDF',
      createdAt: '2023-12-01T14:20:00Z'
    },
    {
      name: 'Reporte de Usuarios Activos',
      type: 'CSV',
      createdAt: '2023-11-28T09:15:00Z'
    }
  ];

  constructor(private adminService: AdminService) {}

  generateCatsReport() {
    this.generatingReport.set(true);
    
    // Simular generación de reporte
    setTimeout(() => {
      console.log('Generando reporte de gatos...');
      this.generatingReport.set(false);
      // Aquí iría la llamada al AdminService
      alert('Reporte de gatos generado exitosamente');
    }, 2000);
  }

  generateAdoptionsReport() {
    this.generatingReport.set(true);
    
    setTimeout(() => {
      console.log('Generando reporte de adopciones...');
      this.generatingReport.set(false);
      alert('Reporte de adopciones generado exitosamente');
    }, 2000);
  }

  generateUsersReport() {
    this.generatingReport.set(true);
    
    setTimeout(() => {
      console.log('Generando reporte de usuarios...');
      this.generatingReport.set(false);
      alert('Reporte de usuarios generado exitosamente');
    }, 2000);
  }

  generateCustomReport() {
    if (!this.isCustomReportValid()) return;
    
    this.generatingReport.set(true);
    
    setTimeout(() => {
      console.log('Generando reporte personalizado:', this.customReport);
      this.generatingReport.set(false);
      alert('Reporte personalizado generado exitosamente');
    }, 3000);
  }

  resetCustomReport() {
    this.customReport = {
      type: '',
      dateFrom: '',
      dateTo: '',
      format: 'excel',
      includeBasicInfo: true,
      includeContactInfo: false,
      includeTimestamps: true,
      includeStats: true,
      includeCharts: false
    };
  }

  isCustomReportValid(): boolean {
    return !!this.customReport.type;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }
}