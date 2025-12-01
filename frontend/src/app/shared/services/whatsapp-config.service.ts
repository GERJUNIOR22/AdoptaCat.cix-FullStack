import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsappConfigService {
  // Configuración de WhatsApp
  private readonly config = {
    // Número de WhatsApp (CAMBIA ESTE NÚMERO POR EL TUYO)
    phoneNumber: '51987654321', // Formato: código país + número sin +
    
    // Horarios de atención (opcional)
    businessHours: {
      start: '09:00',
      end: '18:00',
      timezone: 'America/Lima'
    },
    
    // Configuración de disponibilidad
    isAvailable: true,
    
    // Mensajes personalizados por página
    messages: {
      home: '¡Hola! Me interesa conocer más sobre AdoptaCat 🐱. ¿Podrían ayudarme?',
      adoption: '¡Hola! Me interesa adoptar un gatito 🐱. ¿Podrían ayudarme con información sobre el proceso de adopción?',
      donations: '¡Hola! Me gustaría hacer una donación para AdoptaCat 💝. ¿Podrían darme más información?',
      sponsor: '¡Hola! Me interesa apadrinar un gatito 🏠. ¿Cómo funciona el programa de apadrinamiento?',
      about: '¡Hola! Me gustaría saber más sobre AdoptaCat y cómo puedo colaborar 🤝',
      blog: '¡Hola! He leído su blog y me gustaría saber más sobre el cuidado de gatos 📖'
    }
  };

  getPhoneNumber(): string {
    return this.config.phoneNumber;
  }

  getMessageForPage(page: string): string {
    switch (page) {
      case 'adopta':
        return this.config.messages.adoption;
      case 'donaciones':
        return this.config.messages.donations;
      case 'apadrina':
        return this.config.messages.sponsor;
      case 'nosotros':
        return this.config.messages.about;
      case 'blog':
        return this.config.messages.blog;
      default:
        return this.config.messages.home;
    }
  }

  isBusinessHours(): boolean {
    // Verificar si está dentro del horario de atención
    const now = new Date();
    const currentHour = now.getHours();
    const startHour = Number.parseInt(this.config.businessHours.start.split(':')[0], 10);
    const endHour = Number.parseInt(this.config.businessHours.end.split(':')[0], 10);
    
    return currentHour >= startHour && currentHour < endHour;
  }

  isAvailable(): boolean {
    return this.config.isAvailable && this.isBusinessHours();
  }

  getWhatsAppUrl(message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${this.config.phoneNumber}?text=${encodedMessage}`;
  }
}