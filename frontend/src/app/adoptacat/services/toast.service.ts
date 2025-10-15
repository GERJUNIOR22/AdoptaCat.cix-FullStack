import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  show(message: string) {
    alert(message); // placeholder: usar ngx-toastr o componente propio
  }
}
