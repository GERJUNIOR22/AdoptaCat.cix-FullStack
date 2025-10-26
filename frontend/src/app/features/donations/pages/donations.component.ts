import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DonationAmount {
  amount: number;
  description: string;
  icon: string;
  popular?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  qrCode: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Donaciones
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Tu apoyo nos ayuda a seguir rescatando y cuidando gatos
        </p>
        <div class="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
          <span class="text-red-500 text-xl mr-2">❤️</span>
          <span class="text-gray-700 font-medium">Tu generosidad salva vidas. Cada donación nos ayuda a rescatar, alimentar y cuidar a más gatos necesitados.</span>
        </div>
      </div>
    </section>

    <!-- Impact Stats -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">El Impacto de tu Donación</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Mira cómo cada sol donado se convierte en esperanza y vida para nuestros gatitos
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (amount of donationAmounts(); track amount.amount) {
            <div class="relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 text-center"
                 [class]="amount.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''">
              
              @if (amount.popular) {
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ⭐ Más Popular
                  </span>
                </div>
              }

              <div class="text-4xl mb-4">{{ amount.icon }}</div>
              <div class="text-3xl font-bold text-gray-900 mb-2">S/{{ amount.amount }}</div>
              <p class="text-gray-600 text-sm leading-relaxed">{{ amount.description }}</p>
              
              <button class="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                      (click)="selectAmount(amount.amount)">
                Donar S/{{ amount.amount }}
              </button>
            </div>
          }
        </div>

        <div class="text-center mt-12">
          <p class="text-gray-600 mb-4">¿Prefieres donar una cantidad personalizada?</p>
          <button class="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300"
                  (click)="showCustomAmount.set(!showCustomAmount())">
            Cantidad Personalizada
          </button>
        </div>

        <!-- Custom Amount Input -->
        @if (showCustomAmount()) {
          <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg border">
            <div class="flex items-center">
              <span class="text-gray-500 font-semibold mr-2">S/</span>
              <input type="number" 
                     placeholder="Ingresa tu monto"
                     class="flex-1 text-2xl font-bold text-gray-900 bg-transparent border-none outline-none"
                     #customAmountInput>
              <button class="ml-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                      (click)="selectAmount(+customAmountInput.value)">
                Donar
              </button>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- How Donations Help -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">¿Cómo Ayudan las Donaciones?</h2>
          <p class="text-lg text-gray-600">Cada peso cuenta y se destina directamente al bienestar de nuestros gatitos</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
              <span class="text-2xl">🍽️</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Alimentación</h3>
            <p class="text-gray-600 mb-4">Compramos alimento nutritivo de alta calidad para mantener a nuestros gatos saludables y fuertes.</p>
            <div class="text-sm text-green-600 font-semibold">40% del presupuesto</div>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
              <span class="text-2xl">⚕️</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Atención Médica</h3>
            <p class="text-gray-600 mb-4">Consultas veterinarias, vacunas, esterilizaciones y tratamientos médicos especializados.</p>
            <div class="text-sm text-red-600 font-semibold">35% del presupuesto</div>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
              <span class="text-2xl">🏠</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Refugio</h3>
            <p class="text-gray-600 mb-4">Mantenimiento de las instalaciones, limpieza, servicios básicos y materiales de cuidado.</p>
            <div class="text-sm text-blue-600 font-semibold">25% del presupuesto</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Payment Methods -->
    @if (selectedDonationAmount()) {
      <section class="py-20 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">Completa tu Donación</h2>
            <p class="text-lg text-gray-600 mb-6">
              Donación seleccionada: <span class="font-bold text-purple-600">S/{{ selectedDonationAmount() }}</span>
            </p>
            <p class="text-gray-600">Escoge tu método de pago preferido</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            @for (method of paymentMethods(); track method.id) {
              <div class="bg-white rounded-2xl shadow-lg border-2 hover:border-purple-300 transition-all duration-300 overflow-hidden"
                   [class]="selectedPaymentMethod() === method.id ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'">
                
                <div class="p-6 text-center">
                  <div [class]="'w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ' + method.color">
                    <img [src]="method.logo" [alt]="method.name" class="w-12 h-12 object-contain">
                  </div>
                  
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ method.name }}</h3>
                  <p class="text-gray-600 mb-6">{{ method.description }}</p>

                  <div class="bg-gray-50 p-6 rounded-xl mb-6">
                    <img [src]="method.qrCode" [alt]="'QR ' + method.name" class="w-48 h-48 mx-auto mb-4">
                    <p class="text-sm text-gray-600">Escanea el código QR con tu app de {{ method.name }}</p>
                  </div>

                  <button class="w-full py-3 rounded-xl font-semibold transition-all duration-300"
                          [class]="selectedPaymentMethod() === method.id ? 
                            'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 
                            'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'"
                          (click)="selectPaymentMethod(method.id)">
                    {{ selectedPaymentMethod() === method.id ? '✓ Seleccionado' : 'Seleccionar ' + method.name }}
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Instructions -->
          @if (selectedPaymentMethod()) {
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl">
              <h4 class="text-xl font-bold text-gray-900 mb-4 text-center">
                Instrucciones para {{ getSelectedPaymentMethodName() }}
              </h4>
              <div class="space-y-3 text-gray-700">
                <div class="flex items-start">
                  <span class="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  <p>Abre tu aplicación de {{ getSelectedPaymentMethodName() }}</p>
                </div>
                <div class="flex items-start">
                  <span class="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  <p>Escanea el código QR de arriba</p>
                </div>
                <div class="flex items-start">
                  <span class="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  <p>Verifica que el monto sea <strong>S/{{ selectedDonationAmount() }}</strong></p>
                </div>
                <div class="flex items-start">
                  <span class="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                  <p>Confirma tu donación</p>
                </div>
              </div>
              
              <div class="mt-6 p-4 bg-white rounded-xl">
                <p class="text-center text-gray-600 text-sm">
                  💜 <strong>¡Gracias por tu generosidad!</strong> 
                  Recibirás una confirmación por email una vez que completemos la verificación de tu donación.
                </p>
              </div>
            </div>
          }

          <div class="text-center mt-8">
            <button class="text-gray-500 underline hover:text-gray-700 transition-colors"
                    (click)="resetDonation()">
              Cambiar monto de donación
            </button>
          </div>
        </div>
      </section>
    }

    <!-- Contact Section -->
    <section class="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-8">¿Prefieres otra forma de ayudar?</h2>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">
          Además de las donaciones monetarias, también puedes ayudarnos de otras maneras
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <span class="text-3xl mb-3 block">🥫</span>
            <h3 class="font-bold text-gray-900 mb-2">Donaciones en Especie</h3>
            <p class="text-sm text-gray-600">Alimento, medicinas, mantas y juguetes</p>
          </div>
          
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <span class="text-3xl mb-3 block">📢</span>
            <h3 class="font-bold text-gray-900 mb-2">Difusión</h3>
            <p class="text-sm text-gray-600">Comparte nuestras publicaciones en redes</p>
          </div>
        </div>

        <button class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
          Contáctanos
        </button>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    input[type="number"] {
      -moz-appearance: textfield;
    }
  `]
})
export class DonationsComponent {
  selectedDonationAmount = signal<number | null>(null);
  selectedPaymentMethod = signal<string | null>(null);
  showCustomAmount = signal<boolean>(false);

  donationAmounts = signal<DonationAmount[]>([
    {
      amount: 25,
      description: 'Alimenta a un gatito por una semana completa con comida nutritiva',
      icon: '🍽️'
    },
    {
      amount: 50,
      description: 'Cubre una consulta veterinaria básica y desparasitación',
      icon: '⚕️',
      popular: true
    },
    {
      amount: 100,
      description: 'Financia la esterilización completa de un gato adulto',
      icon: '💉'
    },
    {
      amount: 200,
      description: 'Mantiene a un gato rescatado por un mes completo (comida, medicina, refugio)',
      icon: '🏠'
    }
  ]);

  paymentMethods = signal<PaymentMethod[]>([
    {
      id: 'yape',
      name: 'Yape',
      logo: 'https://logoeps.com/wp-content/uploads/2022/12/yape-vector-logo.png',
      qrCode: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png',
      color: 'bg-gradient-to-br from-purple-100 to-pink-100',
      description: 'Escanea el código QR con tu app de Yape'
    },
    {
      id: 'plin',
      name: 'Plin',
      logo: 'https://seeklogo.com/images/P/plin-logo-67F4A2C0A3-seeklogo.com.png',
      qrCode: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png',
      color: 'bg-gradient-to-br from-green-100 to-emerald-100',
      description: 'Escanea el código QR con tu app de Plin'
    }
  ]);

  selectAmount(amount: number) {
    if (amount > 0) {
      this.selectedDonationAmount.set(amount);
      this.showCustomAmount.set(false);
      // Scroll to payment methods
      setTimeout(() => {
        window.scrollTo({ 
          top: document.documentElement.scrollHeight * 0.6, 
          behavior: 'smooth' 
        });
      }, 100);
    }
  }

  selectPaymentMethod(methodId: string) {
    this.selectedPaymentMethod.set(methodId);
  }

  getSelectedPaymentMethodName(): string {
    const method = this.paymentMethods().find(m => m.id === this.selectedPaymentMethod());
    return method?.name || '';
  }

  resetDonation() {
    this.selectedDonationAmount.set(null);
    this.selectedPaymentMethod.set(null);
    this.showCustomAmount.set(false);
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}