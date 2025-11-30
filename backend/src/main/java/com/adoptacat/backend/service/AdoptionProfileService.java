package com.adoptacat.backend.service;

import com.adoptacat.backend.model.AdoptionProfile;
import com.adoptacat.backend.model.User;
import com.adoptacat.backend.repository.AdoptionProfileRepository;
import com.adoptacat.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdoptionProfileService {
    
    private static final Logger logger = LoggerFactory.getLogger(AdoptionProfileService.class);
    
    private final AdoptionProfileRepository adoptionProfileRepository;
    private final UserRepository userRepository;
    
    public AdoptionProfileService(AdoptionProfileRepository adoptionProfileRepository, 
                                UserRepository userRepository) {
        this.adoptionProfileRepository = adoptionProfileRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Crear o actualizar perfil de adopción
     */
    public AdoptionProfile saveProfile(AdoptionProfile profile) {
        try {
            logger.info("Guardando perfil de adopción para email: {}", profile.getCorreoElectronico());
            
            // Validar datos básicos
            if (profile.getCorreoElectronico() == null || profile.getCorreoElectronico().trim().isEmpty()) {
                logger.warn("Intento de guardar perfil con email vacío");
                throw new InvalidProfileDataException("El email es requerido para el perfil");
            }
            
            // Buscar usuario por email
            Optional<User> userOpt = userRepository.findByEmail(profile.getCorreoElectronico());
            if (userOpt.isPresent()) {
                profile.setUser(userOpt.get());
            }
            
            // Verificar si ya existe un perfil para este usuario/email
            Optional<AdoptionProfile> existingProfile = adoptionProfileRepository.findByEmail(profile.getCorreoElectronico());
            if (existingProfile.isPresent()) {
                // Actualizar perfil existente
                AdoptionProfile existing = existingProfile.get();
                updateExistingProfile(existing, profile);
                AdoptionProfile saved = adoptionProfileRepository.save(existing);
                logger.info("Perfil actualizado exitosamente con ID: {}", saved.getId());
                return saved;
            } else {
                // Crear nuevo perfil
                profile.setStatus(AdoptionProfile.ProfileStatus.PENDING);
                AdoptionProfile saved = adoptionProfileRepository.save(profile);
                logger.info("Nuevo perfil creado exitosamente con ID: {}", saved.getId());
                return saved;
            }
            
        } catch (ProfileServiceException e) {
            // Re-throw excepciones de negocio sin modificar
            throw e;
        } catch (DataAccessException e) {
            logger.error("Error de acceso a datos al guardar perfil de adopción para email: {}", profile.getCorreoElectronico(), e);
            throw new ProfileServiceException("Error de base de datos al guardar el perfil de adopción", e);
        } catch (Exception e) {
            logger.error("Error inesperado al guardar perfil de adopción para email: {}", profile.getCorreoElectronico(), e);
            throw new ProfileServiceException("Error inesperado al guardar el perfil de adopción: " + e.getMessage(), e);
        }
    }
    
    /**
     * Buscar perfil por ID
     */
    public Optional<AdoptionProfile> findById(Long id) {
        try {
            logger.debug("Buscando perfil por ID: {}", id);
            return adoptionProfileRepository.findById(id);
        } catch (DataAccessException e) {
            logger.error("Error de acceso a datos al buscar perfil por ID: {}", id, e);
            throw new ProfileServiceException("Error de base de datos al buscar el perfil", e);
        } catch (Exception e) {
            logger.error("Error inesperado al buscar perfil por ID: {}", id, e);
            throw new ProfileServiceException("Error inesperado al buscar el perfil: " + e.getMessage(), e);
        }
    }
    
    /**
     * Buscar perfil por email
     */
    public Optional<AdoptionProfile> findByEmail(String email) {
        try {
            logger.debug("Buscando perfil por email: {}", email);
            return adoptionProfileRepository.findByEmail(email);
        } catch (DataAccessException e) {
            logger.error("Error de acceso a datos al buscar perfil por email: {}", email, e);
            throw new ProfileServiceException("Error de base de datos al buscar el perfil por email", e);
        } catch (Exception e) {
            logger.error("Error inesperado al buscar perfil por email: {}", email, e);
            throw new ProfileServiceException("Error inesperado al buscar el perfil por email: " + e.getMessage(), e);
        }
    }
    
    /**
     * Buscar perfil por usuario
     */
    public Optional<AdoptionProfile> findByUser(User user) {
        try {
            logger.debug("Buscando perfil para usuario: {}", user.getEmail());
            return adoptionProfileRepository.findByUser(user);
        } catch (DataAccessException e) {
            logger.error("Error de acceso a datos al buscar perfil para usuario: {}", user.getEmail(), e);
            throw new ProfileServiceException("Error de base de datos al buscar el perfil del usuario", e);
        } catch (Exception e) {
            logger.error("Error inesperado al buscar perfil para usuario: {}", user.getEmail(), e);
            throw new ProfileServiceException("Error inesperado al buscar el perfil del usuario: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obtener todos los perfiles
     */
    public List<AdoptionProfile> getAllProfiles() {
        try {
            logger.debug("Obteniendo todos los perfiles de adopción");
            return adoptionProfileRepository.findAll();
        } catch (Exception e) {
            logger.error("Error inesperado al obtener todos los perfiles", e);
            throw new ProfileServiceException("Error al obtener los perfiles: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obtener perfiles por status
     */
    public List<AdoptionProfile> getProfilesByStatus(AdoptionProfile.ProfileStatus status) {
        try {
            logger.debug("Obteniendo perfiles con status: {}", status);
            return adoptionProfileRepository.findByStatus(status);
        } catch (Exception e) {
            logger.error("Error inesperado al obtener perfiles por status: {}", status, e);
            throw new ProfileServiceException("Error al obtener perfiles por estado: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obtener perfiles pendientes de revisión
     */
    public List<AdoptionProfile> getPendingProfiles() {
        try {
            logger.debug("Obteniendo perfiles pendientes de revisión");
            List<AdoptionProfile.ProfileStatus> pendingStatuses = List.of(
                AdoptionProfile.ProfileStatus.PENDING,
                AdoptionProfile.ProfileStatus.UNDER_REVIEW
            );
            return adoptionProfileRepository.findPendingProfiles(pendingStatuses);
        } catch (Exception e) {
            logger.error("Error inesperado al obtener perfiles pendientes", e);
            throw new ProfileServiceException("Error al obtener perfiles pendientes: " + e.getMessage(), e);
        }
    }
    
    /**
     * Actualizar status del perfil
     */
    public AdoptionProfile updateProfileStatus(Long profileId, AdoptionProfile.ProfileStatus newStatus) {
        try {
            logger.info("Actualizando status del perfil {} a {}", profileId, newStatus);
            
            Optional<AdoptionProfile> profileOpt = adoptionProfileRepository.findById(profileId);
            if (profileOpt.isEmpty()) {
                logger.warn("Intento de actualizar status de perfil inexistente: {}", profileId);
                throw new ProfileNotFoundException("Perfil no encontrado con ID: " + profileId);
            }
            
            AdoptionProfile profile = profileOpt.get();
            profile.setStatus(newStatus);
            
            AdoptionProfile saved = adoptionProfileRepository.save(profile);
            logger.info("Status del perfil actualizado exitosamente");
            return saved;
            
        } catch (ProfileServiceException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error inesperado al actualizar status del perfil {}", profileId, e);
            throw new ProfileServiceException("Error al actualizar el estado del perfil: " + e.getMessage(), e);
        }
    }
    
    /**
     * Eliminar perfil
     */
    public void deleteProfile(Long profileId) {
        try {
            logger.info("Eliminando perfil con ID: {}", profileId);
            
            if (!adoptionProfileRepository.existsById(profileId)) {
                logger.warn("Intento de eliminar perfil inexistente: {}", profileId);
                throw new ProfileNotFoundException("Perfil no encontrado con ID: " + profileId);
            }
            
            adoptionProfileRepository.deleteById(profileId);
            logger.info("Perfil eliminado exitosamente");
            
        } catch (ProfileServiceException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error inesperado al eliminar perfil {}", profileId, e);
            throw new ProfileServiceException("Error al eliminar el perfil: " + e.getMessage(), e);
        }
    }
    
    /**
     * Verificar si existe perfil para un email
     */
    public boolean existsByEmail(String email) {
        try {
            return adoptionProfileRepository.existsByCorreoElectronico(email);
        } catch (Exception e) {
            logger.error("Error inesperado al verificar existencia de perfil por email: {}", email, e);
            throw new ProfileServiceException("Error al verificar el perfil: " + e.getMessage(), e);
        }
    }
    
    /**
     * Contar perfiles por status
     */
    public long countByStatus(AdoptionProfile.ProfileStatus status) {
        try {
            return adoptionProfileRepository.countByStatus(status);
        } catch (Exception e) {
            logger.error("Error inesperado al contar perfiles por status: {}", status, e);
            throw new ProfileServiceException("Error al contar perfiles: " + e.getMessage(), e);
        }
    }
    
    /**
     * Actualizar perfil existente con nuevos datos
     */
    private void updateExistingProfile(AdoptionProfile existing, AdoptionProfile newData) {
        // Información del candidato
        existing.setNombreCompleto(newData.getNombreCompleto());
        existing.setCelular(newData.getCelular());
        existing.setFechaNacimiento(newData.getFechaNacimiento());
        existing.setCiudad(newData.getCiudad());
        existing.setDni(newData.getDni());
        existing.setEstadoCivil(newData.getEstadoCivil());
        existing.setDireccion(newData.getDireccion());
        existing.setDistrito(newData.getDistrito());
        existing.setOcupacion(newData.getOcupacion());
        existing.setInstagram(newData.getInstagram());
        existing.setFacebook(newData.getFacebook());
        
        // Experiencia con mascotas
        existing.setPorqueAdoptar(newData.getPorqueAdoptar());
        existing.setTieneMascotasActuales(newData.getTieneMascotasActuales());
        existing.setCualesMascotasActuales(newData.getCualesMascotasActuales());
        existing.setMascotasEsterilizadas(newData.getMascotasEsterilizadas());
        existing.setPorqueNoEsterilizadas(newData.getPorqueNoEsterilizadas());
        existing.setTuvoMascotasAntes(newData.getTuvoMascotasAntes());
        existing.setCualesMascotasAntes(newData.getCualesMascotasAntes());
        existing.setQuePasoConEllas(newData.getQuePasoConEllas());
        
        // Hogar
        existing.setHayNinos(newData.getHayNinos());
        existing.setEdadesNinos(newData.getEdadesNinos());
        existing.setCuantasPersonasCasa(newData.getCuantasPersonasCasa());
        existing.setTodosAcuerdan(newData.getTodosAcuerdan());
        existing.setAlguienAlergico(newData.getAlguienAlergico());
        existing.setPermitenArrendadores(newData.getPermitenArrendadores());
        existing.setPorqueCambiarDomicilio(newData.getPorqueCambiarDomicilio());
        existing.setRupturaFamilia(newData.getRupturaFamilia());
        
        // Recreación y proyección
        existing.setEspacioSuficiente(newData.getEspacioSuficiente());
        existing.setAreasIngresoGato(newData.getAreasIngresoGato());
        existing.setDondeDuermeGato(newData.getDondeDuermeGato());
        existing.setEspaciosEscape(newData.getEspaciosEscape());
        existing.setComportamientoGato(newData.getComportamientoGato());
        
        // Cuidados y gastos
        existing.setResponsableGastos(newData.getResponsableGastos());
        existing.setVisitasVeterinario(newData.getVisitasVeterinario());
        existing.setVacunacionVitaminas(newData.getVacunacionVitaminas());
        existing.setPlacaIdentificacion(newData.getPlacaIdentificacion());
        existing.setAguaLimpia(newData.getAguaLimpia());
        existing.setDesparasitacion(newData.getDesparasitacion());
        existing.setCepilladoPelo(newData.getCepilladoPelo());
        existing.setLimpiezaArenero(newData.getLimpiezaArenero());
        existing.setAlimentacionCroquetas(newData.getAlimentacionCroquetas());
        existing.setRecursosVeterinarios(newData.getRecursosVeterinarios());
        existing.setCompromisoEsterilizar(newData.getCompromisoEsterilizar());
        existing.setAcuerdoVisitaDomiciliaria(newData.getAcuerdoVisitaDomiciliaria());
        
        // Aceptación
        existing.setAceptoCondiciones(newData.getAceptoCondiciones());
        
        // Reset status to PENDING cuando se actualiza
        existing.setStatus(AdoptionProfile.ProfileStatus.PENDING);
    }
    
    /**
     * Excepciones personalizadas para errores del servicio
     */
    public static class ProfileServiceException extends RuntimeException {
        public ProfileServiceException(String message) {
            super(message);
        }
        
        public ProfileServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }
    
    public static class ProfileNotFoundException extends ProfileServiceException {
        public ProfileNotFoundException(String message) {
            super(message);
        }
        
        public ProfileNotFoundException(String message, Throwable cause) {
            super(message, cause);
        }
    }
    
    public static class ProfileAlreadyExistsException extends ProfileServiceException {
        public ProfileAlreadyExistsException(String message) {
            super(message);
        }
        
        public ProfileAlreadyExistsException(String message, Throwable cause) {
            super(message, cause);
        }
    }
    
    public static class InvalidProfileDataException extends ProfileServiceException {
        public InvalidProfileDataException(String message) {
            super(message);
        }
        
        public InvalidProfileDataException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}