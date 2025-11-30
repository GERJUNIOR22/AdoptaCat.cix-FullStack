import { Component } from '@angular/core';

@Component({
  selector: 'app-donations',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Donaciones</h1>
        <p class="text-lg text-gray-600">Esta es la página de donaciones</p>
        <div class="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold mb-4">Prueba Simple</h2>
          <p>Si puedes ver esto, el componente está funcionando correctamente.</p>
        </div>
      </div>
    </div>
  `
})
export class DonationsComponent {
}
