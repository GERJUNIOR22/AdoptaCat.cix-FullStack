import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../shared/services/auth.service';
import { AdoptionProfileService, AdoptionProfileData } from '../../../core/services/adoption-profile.service';

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
  submitSuccess = false;
  submitError = '';

  private readonly fb = inject(FormBuilder);
  private readonly titleService = inject(Title);
  private readonly authService = inject(AuthService);
  private readonly adoptionProfileService = inject(AdoptionProfileService);

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
      cuantasPersonasCasa: [null, [Validators.required, Validators.min(1)]],
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
      this.submitError = '';
      this.submitSuccess = false;
      
      console.log('Formulario enviado:', this.adoptionForm.value);
      
      // Preparar los datos para enviar al backend
      const profileData: AdoptionProfileData = {
        // Información del Candidato
        nombreCompleto: this.adoptionForm.value.nombreCompleto,
        celular: this.adoptionForm.value.celular,
        fechaNacimiento: this.adoptionForm.value.fechaNacimiento,
        ciudad: this.adoptionForm.value.ciudad,
        dni: this.adoptionForm.value.dni,
        estadoCivil: this.adoptionForm.value.estadoCivil,
        direccion: this.adoptionForm.value.direccion,
        distrito: this.adoptionForm.value.distrito,
        ocupacion: this.adoptionForm.value.ocupacion,
        correoElectronico: this.adoptionForm.value.correoElectronico,
        instagram: this.adoptionForm.value.instagram,
        facebook: this.adoptionForm.value.facebook,

        // PARTE 1: EXPERIENCIA CON MASCOTAS
        porqueAdoptar: this.adoptionForm.value.porqueAdoptar,
        tieneMascotasActuales: this.adoptionForm.value.tieneMascotasActuales || false,
        cualesMascotasActuales: this.adoptionForm.value.cualesMascotasActuales,
        mascotasEsterilizadas: this.adoptionForm.value.mascotasEsterilizadas,
        porqueNoEsterilizadas: this.adoptionForm.value.porqueNoEsterilizadas,
        tuvoMascotasAntes: this.adoptionForm.value.tuvoMascotasAntes || false,
        cualesMascotasAntes: this.adoptionForm.value.cualesMascotasAntes,
        quePasoConEllas: this.adoptionForm.value.quePasoConEllas,

        // PARTE 2: HOGAR
        hayNinos: this.adoptionForm.value.hayNinos || false,
        edadesNinos: this.adoptionForm.value.edadesNinos,
        cuantasPersonasCasa: parseInt(this.adoptionForm.value.cuantasPersonasCasa) || 0,
        todosAcuerdan: this.adoptionForm.value.todosAcuerdan,
        alguienAlergico: this.adoptionForm.value.alguienAlergico || false,
        permitenArrendadores: this.adoptionForm.value.permitenArrendadores,
        porqueCambiarDomicilio: this.adoptionForm.value.porqueCambiarDomicilio,
        rupturaFamilia: this.adoptionForm.value.rupturaFamilia,

        // PARTE 3: RECREACIÓN Y PROYECCIÓN
        espacioSuficiente: this.adoptionForm.value.espacioSuficiente,
        areasIngresoGato: this.adoptionForm.value.areasIngresoGato,
        dondeDuermeGato: this.adoptionForm.value.dondeDuermeGato,
        espaciosEscape: this.adoptionForm.value.espaciosEscape,
        comportamientoGato: this.adoptionForm.value.comportamientoGato,

        // PARTE 4: CUIDADOS Y GASTOS
        responsableGastos: this.adoptionForm.value.responsableGastos,
        cuidados: this.adoptionForm.value.cuidados || {
          visitasVeterinario: false,
          vacunacionVitaminas: false,
          placaIdentificacion: false,
          aguaLimpia: false,
          desparasitacion: false,
          cepilladoPelo: false,
          limpiezaArenero: false,
          alimentacionCroquetas: false
        },
        recursosVeterinarios: this.adoptionForm.value.recursosVeterinarios,
        compromisoEsterilizar: this.adoptionForm.value.compromisoEsterilizar,
        acuerdoVisitaDomiciliaria: this.adoptionForm.value.acuerdoVisitaDomiciliaria,

        // Aceptación
        aceptoCondiciones: this.adoptionForm.value.aceptoCondiciones
      };

      // Enviar al backend
      this.adoptionProfileService.createOrUpdateProfile(profileData).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.isSubmitting = false;
          
          if (response.status === 'success') {
            this.submitSuccess = true;
            alert('¡Formulario enviado exitosamente! Nos pondremos en contacto contigo.');
            // Opcionalmente resetear el formulario
            // this.adoptionForm.reset();
          } else {
            this.submitError = response.message || 'Error al enviar el formulario';
            alert('Error: ' + this.submitError);
          }
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);
          this.isSubmitting = false;
          this.submitError = 'Error de conexión. Por favor, intenta nuevamente.';
          alert('Error: ' + this.submitError);
        }
      });
    } else {
      this.markFormGroupTouched(this.adoptionForm);
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    for (const key of Object.keys(formGroup.controls)) {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    }
  }

  get f() {
    return this.adoptionForm.controls;
  }
}