package com.adoptacat.backend.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * DTO para recibir datos del formulario de perfil de adopción desde el frontend
 */
public class AdoptionProfileDTO {

    // Información del Candidato
    @NotBlank(message = "El nombre completo es requerido")
    private String nombreCompleto;

    @NotBlank(message = "El celular es requerido")
    @Pattern(regexp = "^\\d{9}$", message = "El celular debe tener 9 dígitos")
    private String celular;

    private LocalDate fechaNacimiento;
    private String ciudad;

    @NotBlank(message = "El DNI es requerido")
    @Pattern(regexp = "^\\d{8}$", message = "El DNI debe tener 8 dígitos")
    private String dni;

    @NotBlank(message = "El estado civil es requerido")
    private String estadoCivil;

    @NotBlank(message = "La dirección es requerida")
    private String direccion;

    @NotBlank(message = "El distrito es requerido")
    private String distrito;

    private String ocupacion;

    @NotBlank(message = "El correo electrónico es requerido")
    @Email(message = "Debe ser un email válido")
    private String correoElectronico;

    private String instagram;
    private String facebook;

    // PARTE 1: EXPERIENCIA CON MASCOTAS
    @NotBlank(message = "Debe explicar por qué quiere adoptar")
    private String porqueAdoptar;

    private Boolean tieneMascotasActuales = false;
    private String cualesMascotasActuales;
    private Boolean mascotasEsterilizadas;
    private String porqueNoEsterilizadas;
    private Boolean tuvoMascotasAntes = false;
    private String cualesMascotasAntes;
    private String quePasoConEllas;

    // PARTE 2: HOGAR
    private Boolean hayNinos = false;
    private String edadesNinos;

    @NotNull(message = "Debe indicar cuántas personas viven en casa")
    @Min(value = 1, message = "Debe haber al menos 1 persona en la casa")
    private Integer cuantasPersonasCasa;

    @NotNull(message = "Debe indicar si todos están de acuerdo")
    private Boolean todosAcuerdan;

    private Boolean alguienAlergico = false;
    private Boolean permitenArrendadores;

    @NotBlank(message = "Debe explicar qué haría en caso de cambio de domicilio")
    private String porqueCambiarDomicilio;

    @NotBlank(message = "Debe explicar qué haría en caso de ruptura familiar")
    private String rupturaFamilia;

    // PARTE 3: RECREACIÓN Y PROYECCIÓN
    @NotNull(message = "Debe indicar si tiene espacio suficiente")
    private Boolean espacioSuficiente;

    @NotBlank(message = "Debe indicar las áreas de ingreso del gato")
    private String areasIngresoGato;

    @NotBlank(message = "Debe indicar dónde dormiría el gato")
    private String dondeDuermeGato;

    @NotNull(message = "Debe indicar si hay espacios de escape")
    private Boolean espaciosEscape;

    @NotBlank(message = "Debe describir el comportamiento esperado del gato")
    private String comportamientoGato;

    // PARTE 4: CUIDADOS Y GASTOS
    @NotBlank(message = "Debe indicar quién se hará responsable de los gastos")
    private String responsableGastos;

    // Cuidados como objeto anidado
    private CuidadosDTO cuidados;

    @NotNull(message = "Debe indicar si tiene recursos para veterinarios")
    private Boolean recursosVeterinarios;

    @NotNull(message = "Debe comprometerse a esterilizar")
    private Boolean compromisoEsterilizar;

    @NotNull(message = "Debe aceptar la visita domiciliaria")
    private Boolean acuerdoVisitaDomiciliaria;

    // Aceptación
    @AssertTrue(message = "Debe aceptar las condiciones")
    private Boolean aceptoCondiciones;

    // Constructors
    /**
     * Constructor vacío requerido para la deserialización JSON
     */
    public AdoptionProfileDTO() {
        // Constructor vacío para frameworks como Jackson
    }

    // Getters and Setters
    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(String estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getDistrito() {
        return distrito;
    }

    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }

    public String getOcupacion() {
        return ocupacion;
    }

    public void setOcupacion(String ocupacion) {
        this.ocupacion = ocupacion;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public String getFacebook() {
        return facebook;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }

    public String getPorqueAdoptar() {
        return porqueAdoptar;
    }

    public void setPorqueAdoptar(String porqueAdoptar) {
        this.porqueAdoptar = porqueAdoptar;
    }

    public Boolean getTieneMascotasActuales() {
        return tieneMascotasActuales;
    }

    public void setTieneMascotasActuales(Boolean tieneMascotasActuales) {
        this.tieneMascotasActuales = tieneMascotasActuales;
    }

    public String getCualesMascotasActuales() {
        return cualesMascotasActuales;
    }

    public void setCualesMascotasActuales(String cualesMascotasActuales) {
        this.cualesMascotasActuales = cualesMascotasActuales;
    }

    public Boolean getMascotasEsterilizadas() {
        return mascotasEsterilizadas;
    }

    public void setMascotasEsterilizadas(Boolean mascotasEsterilizadas) {
        this.mascotasEsterilizadas = mascotasEsterilizadas;
    }

    public String getPorqueNoEsterilizadas() {
        return porqueNoEsterilizadas;
    }

    public void setPorqueNoEsterilizadas(String porqueNoEsterilizadas) {
        this.porqueNoEsterilizadas = porqueNoEsterilizadas;
    }

    public Boolean getTuvoMascotasAntes() {
        return tuvoMascotasAntes;
    }

    public void setTuvoMascotasAntes(Boolean tuvoMascotasAntes) {
        this.tuvoMascotasAntes = tuvoMascotasAntes;
    }

    public String getCualesMascotasAntes() {
        return cualesMascotasAntes;
    }

    public void setCualesMascotasAntes(String cualesMascotasAntes) {
        this.cualesMascotasAntes = cualesMascotasAntes;
    }

    public String getQuePasoConEllas() {
        return quePasoConEllas;
    }

    public void setQuePasoConEllas(String quePasoConEllas) {
        this.quePasoConEllas = quePasoConEllas;
    }

    public Boolean getHayNinos() {
        return hayNinos;
    }

    public void setHayNinos(Boolean hayNinos) {
        this.hayNinos = hayNinos;
    }

    public String getEdadesNinos() {
        return edadesNinos;
    }

    public void setEdadesNinos(String edadesNinos) {
        this.edadesNinos = edadesNinos;
    }

    public Integer getCuantasPersonasCasa() {
        return cuantasPersonasCasa;
    }

    public void setCuantasPersonasCasa(Integer cuantasPersonasCasa) {
        this.cuantasPersonasCasa = cuantasPersonasCasa;
    }

    public Boolean getTodosAcuerdan() {
        return todosAcuerdan;
    }

    public void setTodosAcuerdan(Boolean todosAcuerdan) {
        this.todosAcuerdan = todosAcuerdan;
    }

    public Boolean getAlguienAlergico() {
        return alguienAlergico;
    }

    public void setAlguienAlergico(Boolean alguienAlergico) {
        this.alguienAlergico = alguienAlergico;
    }

    public Boolean getPermitenArrendadores() {
        return permitenArrendadores;
    }

    public void setPermitenArrendadores(Boolean permitenArrendadores) {
        this.permitenArrendadores = permitenArrendadores;
    }

    public String getPorqueCambiarDomicilio() {
        return porqueCambiarDomicilio;
    }

    public void setPorqueCambiarDomicilio(String porqueCambiarDomicilio) {
        this.porqueCambiarDomicilio = porqueCambiarDomicilio;
    }

    public String getRupturaFamilia() {
        return rupturaFamilia;
    }

    public void setRupturaFamilia(String rupturaFamilia) {
        this.rupturaFamilia = rupturaFamilia;
    }

    public Boolean getEspacioSuficiente() {
        return espacioSuficiente;
    }

    public void setEspacioSuficiente(Boolean espacioSuficiente) {
        this.espacioSuficiente = espacioSuficiente;
    }

    public String getAreasIngresoGato() {
        return areasIngresoGato;
    }

    public void setAreasIngresoGato(String areasIngresoGato) {
        this.areasIngresoGato = areasIngresoGato;
    }

    public String getDondeDuermeGato() {
        return dondeDuermeGato;
    }

    public void setDondeDuermeGato(String dondeDuermeGato) {
        this.dondeDuermeGato = dondeDuermeGato;
    }

    public Boolean getEspaciosEscape() {
        return espaciosEscape;
    }

    public void setEspaciosEscape(Boolean espaciosEscape) {
        this.espaciosEscape = espaciosEscape;
    }

    public String getComportamientoGato() {
        return comportamientoGato;
    }

    public void setComportamientoGato(String comportamientoGato) {
        this.comportamientoGato = comportamientoGato;
    }

    public String getResponsableGastos() {
        return responsableGastos;
    }

    public void setResponsableGastos(String responsableGastos) {
        this.responsableGastos = responsableGastos;
    }

    public CuidadosDTO getCuidados() {
        return cuidados;
    }

    public void setCuidados(CuidadosDTO cuidados) {
        this.cuidados = cuidados;
    }

    public Boolean getRecursosVeterinarios() {
        return recursosVeterinarios;
    }

    public void setRecursosVeterinarios(Boolean recursosVeterinarios) {
        this.recursosVeterinarios = recursosVeterinarios;
    }

    public Boolean getCompromisoEsterilizar() {
        return compromisoEsterilizar;
    }

    public void setCompromisoEsterilizar(Boolean compromisoEsterilizar) {
        this.compromisoEsterilizar = compromisoEsterilizar;
    }

    public Boolean getAcuerdoVisitaDomiciliaria() {
        return acuerdoVisitaDomiciliaria;
    }

    public void setAcuerdoVisitaDomiciliaria(Boolean acuerdoVisitaDomiciliaria) {
        this.acuerdoVisitaDomiciliaria = acuerdoVisitaDomiciliaria;
    }

    public Boolean getAceptoCondiciones() {
        return aceptoCondiciones;
    }

    public void setAceptoCondiciones(Boolean aceptoCondiciones) {
        this.aceptoCondiciones = aceptoCondiciones;
    }

    /**
     * DTO anidado para los cuidados
     */
    public static class CuidadosDTO {
        private Boolean visitasVeterinario = false;
        private Boolean vacunacionVitaminas = false;
        private Boolean placaIdentificacion = false;
        private Boolean aguaLimpia = false;
        private Boolean desparasitacion = false;
        private Boolean cepilladoPelo = false;
        private Boolean limpiezaArenero = false;
        private Boolean alimentacionCroquetas = false;

        // Getters and Setters
        public Boolean getVisitasVeterinario() {
            return visitasVeterinario;
        }

        public void setVisitasVeterinario(Boolean visitasVeterinario) {
            this.visitasVeterinario = visitasVeterinario;
        }

        public Boolean getVacunacionVitaminas() {
            return vacunacionVitaminas;
        }

        public void setVacunacionVitaminas(Boolean vacunacionVitaminas) {
            this.vacunacionVitaminas = vacunacionVitaminas;
        }

        public Boolean getPlacaIdentificacion() {
            return placaIdentificacion;
        }

        public void setPlacaIdentificacion(Boolean placaIdentificacion) {
            this.placaIdentificacion = placaIdentificacion;
        }

        public Boolean getAguaLimpia() {
            return aguaLimpia;
        }

        public void setAguaLimpia(Boolean aguaLimpia) {
            this.aguaLimpia = aguaLimpia;
        }

        public Boolean getDesparasitacion() {
            return desparasitacion;
        }

        public void setDesparasitacion(Boolean desparasitacion) {
            this.desparasitacion = desparasitacion;
        }

        public Boolean getCepilladoPelo() {
            return cepilladoPelo;
        }

        public void setCepilladoPelo(Boolean cepilladoPelo) {
            this.cepilladoPelo = cepilladoPelo;
        }

        public Boolean getLimpiezaArenero() {
            return limpiezaArenero;
        }

        public void setLimpiezaArenero(Boolean limpiezaArenero) {
            this.limpiezaArenero = limpiezaArenero;
        }

        public Boolean getAlimentacionCroquetas() {
            return alimentacionCroquetas;
        }

        public void setAlimentacionCroquetas(Boolean alimentacionCroquetas) {
            this.alimentacionCroquetas = alimentacionCroquetas;
        }
    }
}