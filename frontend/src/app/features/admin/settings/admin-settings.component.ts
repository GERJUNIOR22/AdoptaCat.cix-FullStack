import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p class="mt-2 text-sm text-gray-700">Administra la configuración general de AdoptaCat</p>
      </div>

      <!-- General Settings -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Configuración General</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="site-name" class="block text-sm font-medium text-gray-700">Nombre del Sitio</label>
              <input type="text" 
                     id="site-name"
                     [(ngModel)]="settings.siteName"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="contact-email" class="block text-sm font-medium text-gray-700">Email de Contacto</label>
              <input type="email" 
                     id="contact-email"
                     [(ngModel)]="settings.contactEmail"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="contact-phone" class="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
              <input type="tel" 
                     id="contact-phone"
                     [(ngModel)]="settings.contactPhone"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="max-cats-per-page" class="block text-sm font-medium text-gray-700">Gatos por Página</label>
              <input type="number" 
                     id="max-cats-per-page"
                     [(ngModel)]="settings.maxCatsPerPage"
                     min="1"
                     max="50"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>
          </div>

          <div>
            <label for="site-description" class="block text-sm font-medium text-gray-700">Descripción del Sitio</label>
            <textarea id="site-description"
                      [(ngModel)]="settings.siteDescription"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"></textarea>
          </div>

          <div class="flex items-center">
            <input type="checkbox" 
                   id="maintenance-mode"
                   [(ngModel)]="settings.maintenanceMode"
                   class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
            <label for="maintenance-mode" class="ml-2 block text-sm text-gray-900">
              Modo de Mantenimiento
            </label>
          </div>
        </div>
      </div>

      <!-- Email Settings -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Configuración de Email</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="smtp-host" class="block text-sm font-medium text-gray-700">Servidor SMTP</label>
              <input type="text" 
                     id="smtp-host"
                     [(ngModel)]="emailSettings.smtpHost"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="smtp-port" class="block text-sm font-medium text-gray-700">Puerto SMTP</label>
              <input type="number" 
                     id="smtp-port"
                     [(ngModel)]="emailSettings.smtpPort"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="email-username" class="block text-sm font-medium text-gray-700">Usuario Email</label>
              <input type="text" 
                     id="email-username"
                     [(ngModel)]="emailSettings.username"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="from-email" class="block text-sm font-medium text-gray-700">Email Remitente</label>
              <input type="email" 
                     id="from-email"
                     [(ngModel)]="emailSettings.fromEmail"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>
          </div>

          <div class="flex items-center space-x-6">
            <div class="flex items-center">
              <input type="checkbox" 
                     id="email-enabled"
                     [(ngModel)]="emailSettings.enabled"
                     class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="email-enabled" class="ml-2 block text-sm text-gray-900">
                Habilitar Emails
              </label>
            </div>

            <div class="flex items-center">
              <input type="checkbox" 
                     id="ssl-enabled"
                     [(ngModel)]="emailSettings.sslEnabled"
                     class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="ssl-enabled" class="ml-2 block text-sm text-gray-900">
                SSL/TLS
              </label>
            </div>
          </div>

          <div>
            <button type="button" 
                    (click)="testEmailConnection()"
                    [disabled]="testingEmail()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50">
              <svg *ngIf="testingEmail()" class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Probar Conexión
            </button>
          </div>
        </div>
      </div>

      <!-- Application Settings -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Configuración de Adopciones</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="auto-approve" class="block text-sm font-medium text-gray-700">Auto-Aprobación</label>
              <select id="auto-approve" 
                      [(ngModel)]="adoptionSettings.autoApprove"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                <option value="false">Revisión Manual</option>
                <option value="true">Aprobación Automática</option>
              </select>
            </div>

            <div>
              <label for="application-expiry-days" class="block text-sm font-medium text-gray-700">Días de Expiración</label>
              <input type="number" 
                     id="application-expiry-days"
                     [(ngModel)]="adoptionSettings.applicationExpiryDays"
                     min="1"
                     max="365"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="max-applications-per-user" class="block text-sm font-medium text-gray-700">Máx. Solicitudes por Usuario</label>
              <input type="number" 
                     id="max-applications-per-user"
                     [(ngModel)]="adoptionSettings.maxApplicationsPerUser"
                     min="1"
                     max="10"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="follow-up-days" class="block text-sm font-medium text-gray-700">Días para Seguimiento</label>
              <input type="number" 
                     id="follow-up-days"
                     [(ngModel)]="adoptionSettings.followUpDays"
                     min="1"
                     max="90"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center">
              <input type="checkbox" 
                     id="require-reference"
                     [(ngModel)]="adoptionSettings.requireReference"
                     class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="require-reference" class="ml-2 block text-sm text-gray-900">
                Requerir Referencias
              </label>
            </div>

            <div class="flex items-center">
              <input type="checkbox" 
                     id="require-home-visit"
                     [(ngModel)]="adoptionSettings.requireHomeVisit"
                     class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="require-home-visit" class="ml-2 block text-sm text-gray-900">
                Requerir Visita Domiciliaria
              </label>
            </div>

            <div class="flex items-center">
              <input type="checkbox" 
                     id="send-status-emails"
                     [(ngModel)]="adoptionSettings.sendStatusEmails"
                     class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="send-status-emails" class="ml-2 block text-sm text-gray-900">
                Enviar Emails de Estado
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Configuración de Seguridad</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="session-timeout" class="block text-sm font-medium text-gray-700">Timeout de Sesión (minutos)</label>
              <input type="number" 
                     id="session-timeout"
                     [(ngModel)]="securitySettings.sessionTimeoutMinutes"
                     min="15"
                     max="480"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="max-login-attempts" class="block text-sm font-medium text-gray-700">Máx. Intentos de Login</label>
              <input type="number" 
                     id="max-login-attempts"
                     [(ngModel)]="securitySettings.maxLoginAttempts"
                     min="3"
                     max="10"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="password-min-length" class="block text-sm font-medium text-gray-700">Longitud Mínima Contraseña</label>
              <input type="number" 
                     id="password-min-length"
                     [(ngModel)]="securitySettings.passwordMinLength"
                     min="6"
                     max="20"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>

            <div>
              <label for="lockout-duration" class="block text-sm font-medium text-gray-700">Duración Bloqueo (minutos)</label>
              <input type="number" 
                     id="lockout-duration"
                     [(ngModel)]="securitySettings.lockoutDurationMinutes"
                     min="5"
                     max="60"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center">
              <input type="checkbox" 
                     id="require-email-verification"
                     [(ngModel)]="securitySettings.requireEmailVerification"
                     class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="require-email-verification" class="ml-2 block text-sm text-gray-900">
                Verificación de Email Obligatoria
              </label>
            </div>

            <div class="flex items-center">
              <input type="checkbox" 
                     id="require-special-chars"
                     [(ngModel)]="securitySettings.requireSpecialChars"
                     class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="require-special-chars" class="ml-2 block text-sm text-gray-900">
                Caracteres Especiales en Contraseña
              </label>
            </div>

            <div class="flex items-center">
              <input type="checkbox" 
                     id="enable-2fa"
                     [(ngModel)]="securitySettings.enable2FA"
                     class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="enable-2fa" class="ml-2 block text-sm text-gray-900">
                Habilitar Autenticación 2FA
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button type="button" 
                (click)="resetSettings()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
          Restablecer
        </button>
        <button type="button" 
                (click)="saveSettings()"
                [disabled]="saving()"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg *ngIf="saving()" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Guardar Configuración
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminSettingsComponent {
  saving = signal(false);
  testingEmail = signal(false);

  settings = {
    siteName: 'AdoptaCat',
    siteDescription: 'Plataforma de adopción de gatos',
    contactEmail: 'info@adoptacat.com',
    contactPhone: '+34 600 123 456',
    maxCatsPerPage: 12,
    maintenanceMode: false
  };

  emailSettings = {
    enabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    username: '',
    fromEmail: 'noreply@adoptacat.com',
    sslEnabled: true
  };

  adoptionSettings = {
    autoApprove: 'false',
    applicationExpiryDays: 30,
    maxApplicationsPerUser: 3,
    followUpDays: 14,
    requireReference: true,
    requireHomeVisit: false,
    sendStatusEmails: true
  };

  securitySettings = {
    sessionTimeoutMinutes: 120,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    lockoutDurationMinutes: 15,
    requireEmailVerification: true,
    requireSpecialChars: true,
    enable2FA: false
  };

  constructor(private adminService: AdminService) {}

  saveSettings() {
    this.saving.set(true);
    
    // Simular guardado
    setTimeout(() => {
      console.log('Guardando configuración:', {
        settings: this.settings,
        emailSettings: this.emailSettings,
        adoptionSettings: this.adoptionSettings,
        securitySettings: this.securitySettings
      });
      
      this.saving.set(false);
      alert('Configuración guardada exitosamente');
    }, 2000);
  }

  resetSettings() {
    // Restablecer a valores por defecto
    this.settings = {
      siteName: 'AdoptaCat',
      siteDescription: 'Plataforma de adopción de gatos',
      contactEmail: 'info@adoptacat.com',
      contactPhone: '+34 600 123 456',
      maxCatsPerPage: 12,
      maintenanceMode: false
    };

    this.emailSettings = {
      enabled: true,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      username: '',
      fromEmail: 'noreply@adoptacat.com',
      sslEnabled: true
    };

    this.adoptionSettings = {
      autoApprove: 'false',
      applicationExpiryDays: 30,
      maxApplicationsPerUser: 3,
      followUpDays: 14,
      requireReference: true,
      requireHomeVisit: false,
      sendStatusEmails: true
    };

    this.securitySettings = {
      sessionTimeoutMinutes: 120,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      lockoutDurationMinutes: 15,
      requireEmailVerification: true,
      requireSpecialChars: true,
      enable2FA: false
    };
  }

  testEmailConnection() {
    this.testingEmail.set(true);
    
    setTimeout(() => {
      console.log('Probando conexión de email...');
      this.testingEmail.set(false);
      alert('Conexión de email probada exitosamente');
    }, 3000);
  }
}