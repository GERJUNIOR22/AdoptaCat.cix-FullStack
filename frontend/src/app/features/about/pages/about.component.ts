import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  experience: string;
  specialties: string[];
  email: string;
  phone?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Nosotros
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Conoce al equipo detrás de AdoptaCat y nuestra misión
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-8">
            Los humanos detrás de 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
              💜 AdoptaCat
            </span>
          </h2>
          <p class="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Somos un equipo apasionado de amantes de los gatos dedicados a hacer la diferencia. Cada miembro de 
            nuestro equipo aporta experiencia única y un amor compartido por el bienestar felino.
          </p>
          <p class="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Desde rescatistas hasta veterinarios, coordinadores de adopción y voluntarios, trabajamos juntos para 
            asegurar que cada gato reciba el cuidado y amor que merece mientras encuentra su hogar perfecto.
          </p>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div class="text-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl">
            <div class="text-4xl font-bold text-rose-600 mb-2">500+</div>
            <div class="text-gray-600">Gatos Rescatados</div>
          </div>
          <div class="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl">
            <div class="text-4xl font-bold text-pink-600 mb-2">450+</div>
            <div class="text-gray-600">Adopciones Exitosas</div>
          </div>
          <div class="text-center p-6 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl">
            <div class="text-4xl font-bold text-rose-700 mb-2">8</div>
            <div class="text-gray-600">Años de Experiencia</div>
          </div>
          <div class="text-center p-6 bg-gradient-to-br from-pink-100 to-rose-50 rounded-2xl">
            <div class="text-4xl font-bold text-pink-700 mb-2">24/7</div>
            <div class="text-gray-600">Cuidado Disponible</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Conoce a las personas dedicadas que hacen posible nuestra misión de rescate y adopción
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (member of teamMembers(); track member.id) {
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="relative group cursor-pointer" (click)="openMemberModal(member)">
                <img 
                  [src]="member.image" 
                  [alt]="member.name"
                  class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                  <span class="text-white font-semibold mb-4 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                    Ver más
                  </span>
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ member.name }}</h3>
                <p class="text-rose-600 font-medium mb-4">{{ member.position }}</p>
                <p class="text-gray-600 text-sm leading-relaxed">{{ member.bio }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Los principios que guían todo lo que hacemos en AdoptaCat
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center p-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl">
            <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">💜</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Amor Incondicional</h3>
            <p class="text-gray-600">Cada gato merece amor, cuidado y respeto, sin importar su edad, condición o pasado.</p>
          </div>

          <div class="text-center p-8 bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl">
            <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">🏠</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Hogares Perfectos</h3>
            <p class="text-gray-600">Nos dedicamos a encontrar la familia perfecta para cada gatito que rescatamos.</p>
          </div>

          <div class="text-center p-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl">
            <div class="w-16 h-16 bg-rose-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">🤝</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Transparencia</h3>
            <p class="text-gray-600">Mantenemos comunicación abierta y honesta con adoptantes y la comunidad.</p>
          </div>

          <div class="text-center p-8 bg-gradient-to-br from-pink-100 to-rose-50 rounded-2xl">
            <div class="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">⚕️</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Cuidado Médico</h3>
            <p class="text-gray-600">Garantizamos atención veterinaria completa antes de cada adopción.</p>
          </div>

          <div class="text-center p-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl">
            <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">📚</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Educación</h3>
            <p class="text-gray-600">Educamos a la comunidad sobre el cuidado responsable de mascotas.</p>
          </div>

          <div class="text-center p-8 bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl">
            <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">🌍</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Impacto Social</h3>
            <p class="text-gray-600">Trabajamos para crear una comunidad más compasiva hacia los animales.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What We Do Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-6">Quiénes somos y por qué existimos</h2>
          <p class="text-lg text-gray-600 max-w-4xl mx-auto">
            Somos una asociación sin fines de lucro que busca construir un mundo mejor para los gatos 
            a través de iniciativas sostenibles.
          </p>
        </div>

        <!-- Grid de servicios -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <!-- Adopción responsable -->
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-6 bg-rose-100 rounded-full flex items-center justify-center">
              <span class="text-3xl">💜</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Adopción responsable</h3>
            <p class="text-gray-600">Conectamos gatos rescatados con familias amorosas a través de un proceso cuidadoso de evaluación y seguimiento.</p>
          </div>

          <!-- Donaciones agua y comida -->
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
              <span class="text-3xl">🍽️</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Donaciones agua y comida</h3>
            <p class="text-gray-600">Proporcionamos alimentación nutritiva y agua fresca a gatos necesitados en refugios y la calle.</p>
          </div>

          <!-- Salud y esterilización -->
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-6 bg-rose-200 rounded-full flex items-center justify-center">
              <span class="text-3xl">⚕️</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Salud y esterilización</h3>
            <p class="text-gray-600">Ofrecemos servicios médicos y programas de esterilización para controlar la población felina.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-6">¿Tienes preguntas?</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            ¿Tienes preguntas sobre el proceso de adopción o sobre alguno de nuestros gatos?
            Estamos aquí para ayudarte.
          </p>
        </div>

        <div class="max-w-2xl mx-auto">
          <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div class="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">📱</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Síguenos en redes sociales</h3>
            <p class="text-gray-600 mb-6">
              Síguenos en Instagram y TikTok para ver a nuestros gatitos disponibles y contactarnos directamente
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.instagram.com/adopcat.cix/" 
                target="_blank"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-full hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                <svg class="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                  <path d="M12,2.163c3.204,0,3.584,0.012,4.85,0.07C17.889,2.31,18.454,2.483,18.91,2.711c0.561,0.276,0.962,0.606,1.383,1.026c0.421,0.421,0.751,0.822,1.027,1.383c0.228,0.456,0.401,1.021,0.478,2.06c0.058,1.266,0.07,1.646,0.07,4.85s-0.012,3.584-0.07,4.85c-0.077,1.039-0.25,1.604-0.478,2.06c-0.276,0.561-0.606,0.962-1.027,1.383c-0.421,0.421-0.822,0.751-1.383,1.027c-0.456,0.228-1.021,0.401-2.06,0.478c-1.266,0.058-1.646,0.07-4.85,0.07s-3.584-0.012-4.85-0.07C6.111,21.69,5.546,21.517,5.09,21.289c-0.561-0.276-0.962-0.606-1.383-1.027c-0.421-0.421-0.751-0.822-1.027-1.383c-0.228-0.456-0.401-1.021-0.478-2.06c-0.058-1.266-0.07-1.646-0.07-4.85s0.012-3.584,0.07-4.85C2.31,6.111,2.483,5.546,2.711,5.09C2.987,4.529,3.317,4.128,3.738,3.707C4.159,3.286,4.56,2.956,5.121,2.68c0.456-0.228,1.021-0.401,2.06-0.478C8.447,2.175,8.827,2.163,12,2.163 M12,0C8.741,0,8.333,0.014,7.053,0.072C5.775,0.131,4.905,0.333,4.14,0.63C3.351,0.936,2.681,1.347,2.014,2.014C1.347,2.681,0.935,3.35,0.63,4.14C0.333,4.905,0.131,5.775,0.072,7.053C0.014,8.333,0,8.741,0,12c0,3.259,0.014,3.668,0.072,4.948c0.059,1.277,0.261,2.148,0.558,2.913c0.306,0.788,0.717,1.459,1.384,2.126c0.667,0.666,1.336,1.079,2.124,1.384c0.766,0.296,1.636,0.499,2.913,0.558C8.333,23.986,8.741,24,12,24c3.259,0,3.668-0.014,4.948-0.072c1.277-0.059,2.148-0.262,2.913-0.558c0.788-0.306,1.459-0.718,2.126-1.384c0.666-0.667,1.079-1.335,1.384-2.126c0.296-0.765,0.499-1.636,0.558-2.913c0.058-1.28,0.072-1.689,0.072-4.948c0-3.259-0.014-3.667-0.072-4.947c-0.059-1.277-0.262-2.149-0.558-2.913c-0.306-0.789-0.718-1.459-1.384-2.126C21.319,1.347,20.651,0.935,19.86,0.63C19.095,0.333,18.225,0.131,16.947,0.072C15.668,0.014,15.259,0,12,0z M12,5.838c-3.403,0-6.162,2.759-6.162,6.162c0,3.403,2.759,6.162,6.162,6.162s6.162-2.759,6.162-6.162C18.162,8.597,15.403,5.838,12,5.838z M12,16c-2.209,0-4-1.791-4-4s1.791-4,4-4s4,1.791,4,4S14.209,16,12,16z M19.846,4.595c0,0.795-0.646,1.441-1.441,1.441c-0.795,0-1.441-0.646-1.441-1.441c0-0.795,0.646-1.441,1.441-1.441C19.199,3.154,19.846,3.8,19.846,4.595z"/>
                </svg>
                Instagram
              </a>
              <a 
                href="https://www.tiktok.com/@adopcat.cix" 
                target="_blank"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105"
              >
                <svg class="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <p class="text-gray-600 text-sm">
            Respuesta típica en 24 horas • Disponible de lunes a domingo
          </p>
        </div>
      </div>
    </section>

    <!-- Team Member Modal -->
    @if (selectedMember()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" (click)="closeMemberModal()">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="relative">
            <img 
              [src]="selectedMember()!.image" 
              [alt]="selectedMember()!.name"
              class="w-full h-64 object-cover rounded-t-2xl"
            >
            <button 
              (click)="closeMemberModal()"
              class="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
            >
              <span class="text-gray-600 text-xl">&times;</span>
            </button>
          </div>
          
          <div class="p-8">
            <h3 class="text-3xl font-bold text-gray-900 mb-2">{{ selectedMember()!.name }}</h3>
            <p class="text-rose-600 font-semibold text-lg mb-6">{{ selectedMember()!.position }}</p>
            
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Sobre {{ selectedMember()!.name }}</h4>
              <p class="text-gray-600 leading-relaxed mb-4">{{ selectedMember()!.bio }}</p>
              <p class="text-gray-600 leading-relaxed">{{ selectedMember()!.experience }}</p>
            </div>

            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Especialidades</h4>
              <div class="flex flex-wrap gap-2">
                @for (specialty of selectedMember()!.specialties; track specialty) {
                  <span class="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm font-medium">
                    {{ specialty }}
                  </span>
                }
              </div>
            </div>

            <div class="border-t pt-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Contacto</h4>
              <div class="space-y-2">
                <p class="text-gray-600">
                  <span class="font-medium">Email:</span> {{ selectedMember()!.email }}
                </p>
                @if (selectedMember()!.phone) {
                  <p class="text-gray-600">
                    <span class="font-medium">Teléfono:</span> {{ selectedMember()!.phone }}
                  </p>
                }
              </div>
              
              @if (selectedMember()!.social) {
                <div class="flex gap-4 mt-4">
                  @if (selectedMember()!.social!.linkedin) {
                    <a [href]="selectedMember()!.social!.linkedin" target="_blank" 
                       class="text-blue-600 hover:text-blue-800 transition-colors">
                      LinkedIn
                    </a>
                  }
                  @if (selectedMember()!.social!.twitter) {
                    <a [href]="selectedMember()!.social!.twitter" target="_blank" 
                       class="text-blue-400 hover:text-blue-600 transition-colors">
                      Twitter
                    </a>
                  }
                  @if (selectedMember()!.social!.instagram) {
                    <a [href]="selectedMember()!.social!.instagram" target="_blank" 
                       class="text-pink-600 hover:text-pink-800 transition-colors">
                      Instagram
                    </a>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AboutComponent implements OnInit {
  private titleService = inject(Title);

  selectedMember = signal<TeamMember | null>(null);

  ngOnInit(): void {
    this.titleService.setTitle('AdoptaCat - Nosotros');
  }
  
  teamMembers = signal<TeamMember[]>([
    {
      id: 1,
      name: 'Mafer',
      position: 'Fundadora & Directora Ejecutiva',
      image: 'assets/adoptacat/maferfundadora.webp',
      bio: 'Apasionada defensora de los derechos felinos desde hace más de 10 años.',
      experience: 'Mafer fundó AdoptaCat en 2014 con la visión de crear un refugio donde cada gato reciba atención personalizada y encuentre su hogar perfecto. Su experiencia y pasión por el bienestar animal han sido fundamentales para establecer los altos estándares de cuidado que caracterizan a nuestra organización.',
      specialties: ['Liderazgo Organizacional', 'Bienestar Animal', 'Desarrollo de Programas', 'Gestión de Refugios'],
      email: 'mafer@adoptacat.org',
      phone: '+51 987-654-321',
      social: {
        linkedin: 'https://linkedin.com/in/mafer-adoptacat',
        instagram: 'https://www.instagram.com/adopcat.cix/'
      }
    },
    {
      id: 2,
      name: 'Flavia',
      position: 'Co-Fundadora & Coordinadora de Adopciones',
      image: 'assets/adoptacat/flaviafundadora.webp',
      bio: 'Especialista en encontrar familias perfectas para nuestros felinos.',
      experience: 'Co-fundadora de AdoptaCat junto a Mafer, Flavia ha desarrollado un sistema único para evaluar tanto a los gatos como a las familias potenciales, asegurando matches perfectos. Su dedicación ha resultado en más de 300 adopciones exitosas y duraderas.',
      specialties: ['Evaluación de Adopciones', 'Seguimiento Post-Adopción', 'Entrenamiento de Voluntarios', 'Relaciones Públicas'],
      email: 'flavia@adoptacat.org',
      phone: '+51 987-654-322',
      social: {
        linkedin: 'https://linkedin.com/in/flavia-adoptacat',
        instagram: 'https://www.instagram.com/adopcat.cix/'
      }
    },
    {
      id: 3,
      name: 'Alejandra',
      position: 'Co-Fundadora & Coordinadora de Voluntarios',
      image: 'assets/adoptacat/alejandrafundadora.webp',
      bio: 'Gestiona nuestro increíble equipo de voluntarios dedicados.',
      experience: 'Co-fundadora de AdoptaCat, Alejandra coordina a nuestros voluntarios activos, organizando entrenamientos, horarios y eventos especiales. Su habilidad para inspirar y organizar a las personas ha sido clave para crear una comunidad comprometida y efectiva en torno a nuestra misión.',
      specialties: ['Gestión de Voluntarios', 'Organización de Eventos', 'Capacitación', 'Comunicación Comunitaria'],
      email: 'alejandra@adoptacat.org',
      social: {
        instagram: 'https://www.instagram.com/adopcat.cix/',
        linkedin: 'https://linkedin.com/in/alejandra-adoptacat'
      }
    }
  ]);

  openMemberModal(member: TeamMember) {
    this.selectedMember.set(member);
    document.body.style.overflow = 'hidden';
  }

  closeMemberModal() {
    this.selectedMember.set(null);
    document.body.style.overflow = 'auto';
  }
}