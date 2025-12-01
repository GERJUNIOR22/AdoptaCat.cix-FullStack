package com.adoptacat.backend.mapper;

import com.adoptacat.backend.dto.AdoptionProfileDTO;
import com.adoptacat.backend.model.AdoptionProfile;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre DTO y entidad de AdoptionProfile
 */
@Component
public class AdoptionProfileMapper {

    /**
     * Convierte DTO a entidad
     */
    public AdoptionProfile toEntity(AdoptionProfileDTO dto) {
        if (dto == null) {
            return null;
        }

        AdoptionProfile profile = new AdoptionProfile();

        // Información del candidato
        profile.setNombreCompleto(dto.getNombreCompleto());
        profile.setCelular(dto.getCelular());
        profile.setFechaNacimiento(dto.getFechaNacimiento());
        profile.setCiudad(dto.getCiudad());
        profile.setDni(dto.getDni());
        profile.setEstadoCivil(dto.getEstadoCivil());
        profile.setDireccion(dto.getDireccion());
        profile.setDistrito(dto.getDistrito());
        profile.setOcupacion(dto.getOcupacion());
        profile.setCorreoElectronico(dto.getCorreoElectronico());
        profile.setInstagram(dto.getInstagram());
        profile.setFacebook(dto.getFacebook());

        // Experiencia con mascotas
        profile.setPorqueAdoptar(dto.getPorqueAdoptar());
        profile.setTieneMascotasActuales(dto.getTieneMascotasActuales());
        profile.setCualesMascotasActuales(dto.getCualesMascotasActuales());
        profile.setMascotasEsterilizadas(dto.getMascotasEsterilizadas());
        profile.setPorqueNoEsterilizadas(dto.getPorqueNoEsterilizadas());
        profile.setTuvoMascotasAntes(dto.getTuvoMascotasAntes());
        profile.setCualesMascotasAntes(dto.getCualesMascotasAntes());
        profile.setQuePasoConEllas(dto.getQuePasoConEllas());

        // Hogar
        profile.setHayNinos(dto.getHayNinos());
        profile.setEdadesNinos(dto.getEdadesNinos());
        profile.setCuantasPersonasCasa(dto.getCuantasPersonasCasa());
        profile.setTodosAcuerdan(dto.getTodosAcuerdan());
        profile.setAlguienAlergico(dto.getAlguienAlergico());
        profile.setPermitenArrendadores(dto.getPermitenArrendadores());
        profile.setPorqueCambiarDomicilio(dto.getPorqueCambiarDomicilio());
        profile.setRupturaFamilia(dto.getRupturaFamilia());

        // Recreación y proyección
        profile.setEspacioSuficiente(dto.getEspacioSuficiente());
        profile.setAreasIngresoGato(dto.getAreasIngresoGato());
        profile.setDondeDuermeGato(dto.getDondeDuermeGato());
        profile.setEspaciosEscape(dto.getEspaciosEscape());
        profile.setComportamientoGato(dto.getComportamientoGato());

        // Cuidados y gastos
        profile.setResponsableGastos(dto.getResponsableGastos());
        profile.setRecursosVeterinarios(dto.getRecursosVeterinarios());
        profile.setCompromisoEsterilizar(dto.getCompromisoEsterilizar());
        profile.setAcuerdoVisitaDomiciliaria(dto.getAcuerdoVisitaDomiciliaria());

        // Mapear cuidados si existen
        if (dto.getCuidados() != null) {
            AdoptionProfileDTO.CuidadosDTO cuidados = dto.getCuidados();
            profile.setVisitasVeterinario(cuidados.getVisitasVeterinario());
            profile.setVacunacionVitaminas(cuidados.getVacunacionVitaminas());
            profile.setPlacaIdentificacion(cuidados.getPlacaIdentificacion());
            profile.setAguaLimpia(cuidados.getAguaLimpia());
            profile.setDesparasitacion(cuidados.getDesparasitacion());
            profile.setCepilladoPelo(cuidados.getCepilladoPelo());
            profile.setLimpiezaArenero(cuidados.getLimpiezaArenero());
            profile.setAlimentacionCroquetas(cuidados.getAlimentacionCroquetas());
        }

        // Aceptación
        profile.setAceptoCondiciones(dto.getAceptoCondiciones());

        return profile;
    }

    /**
     * Convierte entidad a DTO
     */
    public AdoptionProfileDTO toDTO(AdoptionProfile profile) {
        if (profile == null) {
            return null;
        }

        AdoptionProfileDTO dto = new AdoptionProfileDTO();

        // Información del candidato
        dto.setNombreCompleto(profile.getNombreCompleto());
        dto.setCelular(profile.getCelular());
        dto.setFechaNacimiento(profile.getFechaNacimiento());
        dto.setCiudad(profile.getCiudad());
        dto.setDni(profile.getDni());
        dto.setEstadoCivil(profile.getEstadoCivil());
        dto.setDireccion(profile.getDireccion());
        dto.setDistrito(profile.getDistrito());
        dto.setOcupacion(profile.getOcupacion());
        dto.setCorreoElectronico(profile.getCorreoElectronico());
        dto.setInstagram(profile.getInstagram());
        dto.setFacebook(profile.getFacebook());

        // Experiencia con mascotas
        dto.setPorqueAdoptar(profile.getPorqueAdoptar());
        dto.setTieneMascotasActuales(profile.getTieneMascotasActuales());
        dto.setCualesMascotasActuales(profile.getCualesMascotasActuales());
        dto.setMascotasEsterilizadas(profile.getMascotasEsterilizadas());
        dto.setPorqueNoEsterilizadas(profile.getPorqueNoEsterilizadas());
        dto.setTuvoMascotasAntes(profile.getTuvoMascotasAntes());
        dto.setCualesMascotasAntes(profile.getCualesMascotasAntes());
        dto.setQuePasoConEllas(profile.getQuePasoConEllas());

        // Hogar
        dto.setHayNinos(profile.getHayNinos());
        dto.setEdadesNinos(profile.getEdadesNinos());
        dto.setCuantasPersonasCasa(profile.getCuantasPersonasCasa());
        dto.setTodosAcuerdan(profile.getTodosAcuerdan());
        dto.setAlguienAlergico(profile.getAlguienAlergico());
        dto.setPermitenArrendadores(profile.getPermitenArrendadores());
        dto.setPorqueCambiarDomicilio(profile.getPorqueCambiarDomicilio());
        dto.setRupturaFamilia(profile.getRupturaFamilia());

        // Recreación y proyección
        dto.setEspacioSuficiente(profile.getEspacioSuficiente());
        dto.setAreasIngresoGato(profile.getAreasIngresoGato());
        dto.setDondeDuermeGato(profile.getDondeDuermeGato());
        dto.setEspaciosEscape(profile.getEspaciosEscape());
        dto.setComportamientoGato(profile.getComportamientoGato());

        // Cuidados y gastos
        dto.setResponsableGastos(profile.getResponsableGastos());
        dto.setRecursosVeterinarios(profile.getRecursosVeterinarios());
        dto.setCompromisoEsterilizar(profile.getCompromisoEsterilizar());
        dto.setAcuerdoVisitaDomiciliaria(profile.getAcuerdoVisitaDomiciliaria());

        // Mapear cuidados
        AdoptionProfileDTO.CuidadosDTO cuidados = new AdoptionProfileDTO.CuidadosDTO();
        cuidados.setVisitasVeterinario(profile.getVisitasVeterinario());
        cuidados.setVacunacionVitaminas(profile.getVacunacionVitaminas());
        cuidados.setPlacaIdentificacion(profile.getPlacaIdentificacion());
        cuidados.setAguaLimpia(profile.getAguaLimpia());
        cuidados.setDesparasitacion(profile.getDesparasitacion());
        cuidados.setCepilladoPelo(profile.getCepilladoPelo());
        cuidados.setLimpiezaArenero(profile.getLimpiezaArenero());
        cuidados.setAlimentacionCroquetas(profile.getAlimentacionCroquetas());
        dto.setCuidados(cuidados);

        // Aceptación
        dto.setAceptoCondiciones(profile.getAceptoCondiciones());

        return dto;
    }
}