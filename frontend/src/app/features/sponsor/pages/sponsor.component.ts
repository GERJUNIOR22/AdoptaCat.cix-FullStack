import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

interface SponsorshipPlan {
  id: number;
  name: string;
  price: number;
  duration: string;
  icon: string;
  benefits: string[];
  popular?: boolean;
  color: string;
}

interface SponsoredCat {
  id: number;
  name: string;
  age: string;
  story: string;
  image: string;
  monthlyNeeds: number;
  currentSponsors: number;
  maxSponsors: number;
  specialNeeds?: string;
}

@Component({
  selector: 'app-sponsor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Apadrina
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Ayúdanos a llevar alimento a los albergues y recibe beneficios exclusivos
        </p>
        <div class="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
          <span class="text-purple-600 font-semibold">💜</span>
          <span class="ml-2 text-gray-700">¡Apadrina y recibe cientos de descuentos en nuestros aliados!</span>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Apadrinazgo para Esterilización</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Tu donación ayuda directamente a esterilizar gatos para controlar la población felina y darles una mejor vida
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">⚕️</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">1. Esterilización</h3>
            <p class="text-gray-600">Tu aporte se destina directamente a cirugías de esterilización</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">�</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">2. Cuidados Post-Operatorios</h3>
            <p class="text-gray-600">Incluye medicinas y cuidados durante la recuperación</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">💜</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">3. Impacto Social</h3>
            <p class="text-gray-600">Ayudas a controlar la sobrepoblación felina</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Donation Options -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Formas de Apadrinar</h2>
          <p class="text-lg text-gray-600">Elige la opción que mejor se adapte a ti</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Apadrinazgo Completo -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">⚕️</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Apadrinazgo Completo</h3>
            <p class="text-gray-600 mb-6">Cubres el costo completo de una esterilización (S/150)</p>
            <button 
              (click)="showPaymentOptions('completo')"
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
              Apadrinar Completo - S/150
            </button>
          </div>

          <!-- Donación Libre -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center">
            <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">💜</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Donación Libre</h3>
            <p class="text-gray-600 mb-6">Aporta la cantidad que desees para ayudar con las esterilizaciones</p>
            <button 
              (click)="showPaymentOptions('libre')"
              class="w-full bg-gradient-to-r from-pink-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-orange-700 transition-all duration-300">
              Hacer Donación Libre
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Payment Options Modal -->
    @if (showPaymentModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" (click)="closePaymentModal()">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="p-8">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                {{ selectedDonationType() === 'completo' ? 'Apadrinazgo Completo - S/150' : 'Donación Libre' }}
              </h3>
              <p class="text-gray-600">
                {{ selectedDonationType() === 'completo' 
                  ? 'Gracias por cubrir una esterilización completa' 
                  : 'Cualquier monto ayuda a nuestros gatitos' }}
              </p>
            </div>

            @if (selectedDonationType() === 'libre') {
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Monto a donar (S/)</label>
                <input 
                  type="number" 
                  placeholder="Ingresa el monto que deseas donar"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
            }

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Yape QR -->
              <div class="text-center p-6 bg-purple-50 rounded-xl">
                <h4 class="font-semibold text-gray-900 mb-4">Pagar con Yape</h4>
                <div class="w-40 h-40 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-gray-200">
                  <span class="text-gray-500 text-sm">QR Code Yape</span>
                </div>
                <p class="text-sm text-gray-600">Escanea el código QR con tu app Yape</p>
              </div>

              <!-- Plin QR -->
              <div class="text-center p-6 bg-pink-50 rounded-xl">
                <h4 class="font-semibold text-gray-900 mb-4">Pagar con Plin</h4>
                <div class="w-40 h-40 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-gray-200">
                  <span class="text-gray-500 text-sm">QR Code Plin</span>
                </div>
                <p class="text-sm text-gray-600">Escanea el código QR con tu app Plin</p>
              </div>
            </div>

            <div class="bg-orange-50 p-4 rounded-xl mb-6">
              <p class="text-sm text-orange-800 text-center">
                <span class="font-semibold">� Importante:</span> Después de hacer tu donación, envíanos el comprobante por Instagram 
                <a href="https://www.instagram.com/adopcat.cix/" target="_blank" class="text-rose-600 hover:text-rose-800">@adopcat.cix</a>
              </p>
            </div>

            <div class="flex gap-3">
              <button (click)="closePaymentModal()" 
                      class="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                Cancelar
              </button>
              <button class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                Ya realicé mi donación
              </button>
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
export class SponsorComponent implements OnInit {
  private titleService = inject(Title);

  showPaymentModal = signal<boolean>(false);

  ngOnInit(): void {
    this.titleService.setTitle('Apadrina | AdopCat');
  }
  selectedDonationType = signal<string>('');

  showPaymentOptions(type: string) {
    this.selectedDonationType.set(type);
    this.showPaymentModal.set(true);
  }

  closePaymentModal() {
    this.showPaymentModal.set(false);
    this.selectedDonationType.set('');
  }
}