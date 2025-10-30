import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  adoptionForm!: FormGroup;
  isSubmitting = false;

  private fb = inject(FormBuilder);
  private titleService = inject(Title);
  private authService = inject(AuthService);

  ngOnInit() {
    this.titleService.setTitle('Perfil de Adopción | AdoptaCat');

    this.adoptionForm = this.fb.group({
      // Información del Candidato
      nombreCompleto: ['', [Validators.required]],
      celular: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      fechaNacimiento: ['', [Validators.required]],
      ciudad: [''],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      estadoCivil: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      ocupacion: [''],
      correoElectronico: ['', [Validators.required, Validators.email]],
      instagram: [''],
      facebook: [''],

      // PARTE 1: EXPERIENCIA CON MASCOTAS
      porqueAdoptar: ['', [Validators.required]],
      tieneMascotasActuales: [false],
      cualesMascotasActuales: [''],
      mascotasEsterilizadas: [null],
      porqueNoEsterilizadas: [''],
      tuvoMascotasAntes: [false],
      cualesMascotasAntes: [''],
      quePasoConEllas: [''],

      // PARTE 2: HOGAR
      hayNinos: [false],
      edadesNinos: [''],
      cuantasPersonasCasa: ['', [Validators.required]],
      todosAcuerdan: [null, [Validators.required]],
      alguienAlergico: [false],
      permitenArrendadores: [null],
      porqueCambiarDomicilio: ['', [Validators.required]],
      rupturaFamilia: ['', [Validators.required]],

      // PARTE 3: RECREACIÓN Y PROYECCIÓN
      espacioSuficiente: [null, [Validators.required]],
      areasIngresoGato: ['', [Validators.required]],
      dondeDuermeGato: ['', [Validators.required]],
      espaciosEscape: [null, [Validators.required]],
      comportamientoGato: ['', [Validators.required]],

      // PARTE 4: CUIDADOS Y GASTOS
      responsableGastos: ['', [Validators.required]],
      cuidados: this.fb.group({
        visitasVeterinario: [false],
        vacunacionVitaminas: [false],
        placaIdentificacion: [false],
        aguaLimpia: [false],
        desparasitacion: [false],
        cepilladoPelo: [false],
        limpiezaArenero: [false],
        alimentacionCroquetas: [false]
      }),
      recursosVeterinarios: [null, [Validators.required]],
      compromisoEsterilizar: [null, [Validators.required]],
      acuerdoVisitaDomiciliaria: [null, [Validators.required]],

      // Aceptación
      aceptoCondiciones: [false, [Validators.requiredTrue]]
    });

    // Prefill with user data if logged in
    const user = this.authService.user();
    if (user) {
      this.adoptionForm.patchValue({
        nombreCompleto: user.name,
        correoElectronico: user.email
      });
    }
  }

  onSubmit() {
    if (this.adoptionForm.valid) {
      this.isSubmitting = true;
      console.log('Formulario enviado:', this.adoptionForm.value);
      // Aquí iría la lógica para enviar al backend
      // Por ahora, solo log
      setTimeout(() => {
        this.isSubmitting = false;
        alert('Formulario enviado exitosamente. Nos pondremos en contacto contigo.');
      }, 2000);
    } else {
      this.markFormGroupTouched(this.adoptionForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get f() {
    return this.adoptionForm.controls;
  }
}