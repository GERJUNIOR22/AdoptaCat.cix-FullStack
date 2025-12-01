package com.adoptacat.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ApplicationFormRequest {

    @NotBlank
    private String nombreCompleto;

    @NotBlank
    private String telefono;

    private String direccion;
    private String ciudad;
    private String tipoVivienda;
    private String experienciaPrevias;
    private Boolean tieneMasMascotas = false;
    private String detallesMascotasActuales;
    private Boolean tieneHijos = false;
    private String edadesHijos;
    private String tamanoHogar;
    private Boolean todosAcuerdan = false;
    private Boolean tieneAlergias = false;
    private String planesMudanza;
    private Boolean tieneEspacio = false;
    private String areasAcceso;
    private String lugarDormir;
    private Boolean tieneEspaciosEscape = false;
    private String respuestaProblemasComportamiento;
    private String quienPagaGastos;
    private Boolean tieneRecursosVeterinarios = false;
    private String compromisosCuidado;
    private Boolean compromisoEsterilizar = false;
    private Boolean aceptaVisitas = false;
    private Boolean aceptaTerminos = false;

    // Constructors
    public ApplicationFormRequest() {
    }

    // Getters and Setters (I'll add a few key ones, assume the rest are similar)
    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getTipoVivienda() {
        return tipoVivienda;
    }

    public void setTipoVivienda(String tipoVivienda) {
        this.tipoVivienda = tipoVivienda;
    }

    public String getExperienciaPrevias() {
        return experienciaPrevias;
    }

    public void setExperienciaPrevias(String experienciaPrevias) {
        this.experienciaPrevias = experienciaPrevias;
    }

    public Boolean getTieneMasMascotas() {
        return tieneMasMascotas;
    }

    public void setTieneMasMascotas(Boolean tieneMasMascotas) {
        this.tieneMasMascotas = tieneMasMascotas;
    }

    public String getDetallesMascotasActuales() {
        return detallesMascotasActuales;
    }

    public void setDetallesMascotasActuales(String detallesMascotasActuales) {
        this.detallesMascotasActuales = detallesMascotasActuales;
    }

    public Boolean getTieneHijos() {
        return tieneHijos;
    }

    public void setTieneHijos(Boolean tieneHijos) {
        this.tieneHijos = tieneHijos;
    }

    public String getEdadesHijos() {
        return edadesHijos;
    }

    public void setEdadesHijos(String edadesHijos) {
        this.edadesHijos = edadesHijos;
    }

    public String getTamanoHogar() {
        return tamanoHogar;
    }

    public void setTamanoHogar(String tamanoHogar) {
        this.tamanoHogar = tamanoHogar;
    }

    public Boolean getTodosAcuerdan() {
        return todosAcuerdan;
    }

    public void setTodosAcuerdan(Boolean todosAcuerdan) {
        this.todosAcuerdan = todosAcuerdan;
    }

    public Boolean getTieneAlergias() {
        return tieneAlergias;
    }

    public void setTieneAlergias(Boolean tieneAlergias) {
        this.tieneAlergias = tieneAlergias;
    }

    public String getPlanesMudanza() {
        return planesMudanza;
    }

    public void setPlanesMudanza(String planesMudanza) {
        this.planesMudanza = planesMudanza;
    }

    public Boolean getTieneEspacio() {
        return tieneEspacio;
    }

    public void setTieneEspacio(Boolean tieneEspacio) {
        this.tieneEspacio = tieneEspacio;
    }

    public String getAreasAcceso() {
        return areasAcceso;
    }

    public void setAreasAcceso(String areasAcceso) {
        this.areasAcceso = areasAcceso;
    }

    public String getLugarDormir() {
        return lugarDormir;
    }

    public void setLugarDormir(String lugarDormir) {
        this.lugarDormir = lugarDormir;
    }

    public Boolean getTieneEspaciosEscape() {
        return tieneEspaciosEscape;
    }

    public void setTieneEspaciosEscape(Boolean tieneEspaciosEscape) {
        this.tieneEspaciosEscape = tieneEspaciosEscape;
    }

    public String getRespuestaProblemasComportamiento() {
        return respuestaProblemasComportamiento;
    }

    public void setRespuestaProblemasComportamiento(String respuestaProblemasComportamiento) {
        this.respuestaProblemasComportamiento = respuestaProblemasComportamiento;
    }

    public String getQuienPagaGastos() {
        return quienPagaGastos;
    }

    public void setQuienPagaGastos(String quienPagaGastos) {
        this.quienPagaGastos = quienPagaGastos;
    }

    public Boolean getTieneRecursosVeterinarios() {
        return tieneRecursosVeterinarios;
    }

    public void setTieneRecursosVeterinarios(Boolean tieneRecursosVeterinarios) {
        this.tieneRecursosVeterinarios = tieneRecursosVeterinarios;
    }

    public String getCompromisosCuidado() {
        return compromisosCuidado;
    }

    public void setCompromisosCuidado(String compromisosCuidado) {
        this.compromisosCuidado = compromisosCuidado;
    }

    public Boolean getCompromisoEsterilizar() {
        return compromisoEsterilizar;
    }

    public void setCompromisoEsterilizar(Boolean compromisoEsterilizar) {
        this.compromisoEsterilizar = compromisoEsterilizar;
    }

    public Boolean getAceptaVisitas() {
        return aceptaVisitas;
    }

    public void setAceptaVisitas(Boolean aceptaVisitas) {
        this.aceptaVisitas = aceptaVisitas;
    }

    public Boolean getAceptaTerminos() {
        return aceptaTerminos;
    }

    public void setAceptaTerminos(Boolean aceptaTerminos) {
        this.aceptaTerminos = aceptaTerminos;
    }
}