package com.adoptacat.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "adoption_profiles")
public class AdoptionProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Información del Candidato
    @Column(name = "nombre_completo", nullable = false)
    @NotBlank
    private String nombreCompleto;

    @Column(nullable = false)
    @NotBlank
    private String celular;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    private String ciudad;

    @Column(nullable = false)
    @NotBlank
    private String dni;

    @Column(name = "estado_civil", nullable = false)
    @NotBlank
    private String estadoCivil;

    @Column(nullable = false)
    @NotBlank
    private String direccion;

    @Column(nullable = false)
    @NotBlank
    private String distrito;

    private String ocupacion;

    @Column(name = "correo_electronico", nullable = false)
    @Email
    @NotBlank
    private String correoElectronico;

    private String instagram;
    private String facebook;

    // PARTE 1: EXPERIENCIA CON MASCOTAS
    @Column(name = "porque_adoptar", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String porqueAdoptar;

    @Column(name = "tiene_mascotas_actuales")
    private Boolean tieneMascotasActuales = false;

    @Column(name = "cuales_mascotas_actuales", columnDefinition = "TEXT")
    private String cualesMascotasActuales;

    @Column(name = "mascotas_esterilizadas")
    private Boolean mascotasEsterilizadas;

    @Column(name = "porque_no_esterilizadas", columnDefinition = "TEXT")
    private String porqueNoEsterilizadas;

    @Column(name = "tuvo_mascotas_antes")
    private Boolean tuvoMascotasAntes = false;

    @Column(name = "cuales_mascotas_antes", columnDefinition = "TEXT")
    private String cualesMascotasAntes;

    @Column(name = "que_paso_con_ellas", columnDefinition = "TEXT")
    private String quePasoConEllas;

    // PARTE 2: HOGAR
    @Column(name = "hay_ninos")
    private Boolean hayNinos = false;

    @Column(name = "edades_ninos")
    private String edadesNinos;

    @Column(name = "cuantas_personas_casa", nullable = false)
    @NotNull
    @Min(value = 1, message = "Debe haber al menos 1 persona en la casa")
    private Integer cuantasPersonasCasa;

    @Column(name = "todos_acuerdan", nullable = false)
    private Boolean todosAcuerdan;

    @Column(name = "alguien_alergico")
    private Boolean alguienAlergico = false;

    @Column(name = "permiten_arrendadores")
    private String permitenArrendadores;

    @Column(name = "porque_cambiar_domicilio", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String porqueCambiarDomicilio;

    @Column(name = "ruptura_familia", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String rupturaFamilia;

    // PARTE 3: RECREACIÓN Y PROYECCIÓN
    @Column(name = "espacio_suficiente", nullable = false)
    private Boolean espacioSuficiente;

    @Column(name = "areas_ingreso_gato", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String areasIngresoGato;

    @Column(name = "donde_duerme_gato", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String dondeDuermeGato;

    @Column(name = "espacios_escape", nullable = false)
    private Boolean espaciosEscape;

    @Column(name = "comportamiento_gato", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String comportamientoGato;

    // PARTE 4: CUIDADOS Y GASTOS
    @Column(name = "responsable_gastos", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String responsableGastos;

    // Cuidados (stored as JSON string or separate boolean fields)
    @Column(name = "visitas_veterinario")
    private Boolean visitasVeterinario = false;

    @Column(name = "vacunacion_vitaminas")
    private Boolean vacunacionVitaminas = false;

    @Column(name = "placa_identificacion")
    private Boolean placaIdentificacion = false;

    @Column(name = "agua_limpia")
    private Boolean aguaLimpia = false;

    @Column(name = "desparasitacion")
    private Boolean desparasitacion = false;

    @Column(name = "cepillado_pelo")
    private Boolean cepilladoPelo = false;

    @Column(name = "limpieza_arenero")
    private Boolean limpiezaArenero = false;

    @Column(name = "alimentacion_croquetas")
    private Boolean alimentacionCroquetas = false;

    @Column(name = "recursos_veterinarios", nullable = false)
    private Boolean recursosVeterinarios;

    @Column(name = "compromiso_esterilizar", nullable = false)
    private Boolean compromisoEsterilizar;

    @Column(name = "acuerdo_visita_domiciliaria", nullable = false)
    private Boolean acuerdoVisitaDomiciliaria;

    // Aceptación
    @Column(name = "acepto_condiciones", nullable = false)
    private Boolean aceptoCondiciones;

    // Relación con usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Status del perfil
    @Enumerated(EnumType.STRING)
    private ProfileStatus status = ProfileStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    /**
     * Constructor vacío requerido por JPA
     */
    public AdoptionProfile() {
        // Constructor vacío para JPA/Hibernate
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getPermitenArrendadores() {
        return permitenArrendadores;
    }

    public void setPermitenArrendadores(String permitenArrendadores) {
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProfileStatus getStatus() {
        return status;
    }

    public void setStatus(ProfileStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public enum ProfileStatus {
        PENDING, APPROVED, REJECTED, UNDER_REVIEW
    }
}