import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HeroComponent } from '../components/hero.component';
import { FeaturedCatsComponent } from '../components/featured-cats.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroComponent, FeaturedCatsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private titleService = inject(Title);

  // Signals para controlar los modales
  public showAdoptionModal = signal(false);
  public showDonationModal = signal(false);
  public showHealthModal = signal(false);
  public showEducationModal = signal(false);

  // Signal para controlar el acordeón de FAQ
  public activeFaqIndex = signal<number | null>(null);

  ngOnInit(): void {
    this.titleService.setTitle('Inicio | AdopCat');
  }

  // Métodos para abrir modales
  public openAdoptionModal(): void {
    this.showAdoptionModal.set(true);
  }

  public openDonationModal(): void {
    this.showDonationModal.set(true);
  }

  public openHealthModal(): void {
    this.showHealthModal.set(true);
  }

  public openEducationModal(): void {
    this.showEducationModal.set(true);
  }

  // Métodos para cerrar modales
  public closeAdoptionModal(): void {
    this.showAdoptionModal.set(false);
  }

  public closeDonationModal(): void {
    this.showDonationModal.set(false);
  }

  public closeHealthModal(): void {
    this.showHealthModal.set(false);
  }

  public closeEducationModal(): void {
    this.showEducationModal.set(false);
  }

  // Método para manejar el acordeón de FAQ
  public toggleFaq(index: number): void {
    if (this.activeFaqIndex() === index) {
      this.activeFaqIndex.set(null); // Cerrar si ya está abierto
    } else {
      this.activeFaqIndex.set(index); // Abrir el nuevo y cerrar cualquier otro
    }
  }

  // Datos de las FAQ
  public faqData = [
    {
      question: '¿Cuáles son los requisitos para adoptar un gato?',
      answer: 'Para adoptar un gato necesitas ser mayor de edad, contar con documento de identidad, tener un lugar seguro para el gato, demostrar estabilidad económica para cubrir sus necesidades básicas, y pasar por una entrevista personal y visita domiciliaria. También evaluamos la compatibilidad entre el adoptante y el gato.'
    },
    {
      question: '¿Cuánto cuesta adoptar?',
      answer: 'La adopción tiene un costo de recuperación que varía entre S/. 150 - S/. 250, el cual cubre gastos de esterilización, vacunación, desparasitación, microchip y atención veterinaria. Este monto ayuda a sostener nuestros programas de rescate y cuidado de otros gatos necesitados.'
    },
    {
      question: '¿Los gatos vienen esterilizados y vacunados?',
      answer: 'Sí, todos nuestros gatos son entregados completamente esterilizados, vacunados (triple felina y antirrábica), desparasitados y con microchip de identificación. También incluimos un certificado de salud veterinaria y el carné de vacunación actualizado.'
    },
    {
      question: '¿Puedo devolver al gato si no me adapto?',
      answer: 'Entendemos que a veces las cosas no funcionan como esperamos. Sí, puedes devolver al gato si surge algún problema de adaptación. Ofrecemos un período de prueba de 15 días y brindamos asesoramiento continuo. Nuestro objetivo es el bienestar tanto del gato como de la familia adoptante.'
    },
    {
      question: '¿Cuánto tiempo toma el proceso de adopción?',
      answer: 'El proceso completo toma entre 7 a 14 días. Incluye: entrevista inicial (1-2 días), visita domiciliaria (3-5 días), período de reflexión (2-3 días), y finalización de documentos (1-2 días). Trabajamos de manera eficiente pero responsable para asegurar adopciones exitosas.'
    },
    {
      question: '¿Puedo adoptar si tengo otras mascotas?',
      answer: 'Sí, puedes adoptar teniendo otras mascotas, pero evaluamos cuidadosamente la compatibilidad. Tus mascotas actuales deben estar vacunadas y esterilizadas. Organizamos encuentros supervisados para asegurar una buena convivencia antes de finalizar la adopción.'
    },
    {
      question: '¿Qué incluye el kit de adopción?',
      answer: 'El kit de adopción incluye: collar con placa de identificación, correa ajustable, comedero y bebedero, juguetes seguros para gatos, manta suave, guía de cuidados básicos, cupones de descuento para veterinaria, y alimento premium para los primeros días. Todo lo necesario para que tu nuevo compañero se sienta como en casa.'
    },
    {
      question: '¿Puedo conocer al gato antes de adoptar?',
      answer: 'Por supuesto, es fundamental que conozcas al gato antes de tomar la decisión. Organizamos encuentros en nuestro centro de adopción donde puedes interactuar con el gato, conocer su personalidad y evaluar la compatibilidad. También ofrecemos sesiones de socialización para que ambos se sientan cómodos.'
    }
  ];
}
