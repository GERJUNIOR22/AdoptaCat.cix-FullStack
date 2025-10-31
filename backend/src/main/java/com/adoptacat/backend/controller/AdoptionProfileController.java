package com.adoptacat.backend.controller;

import com.adoptacat.backend.dto.AdoptionProfileDTO;
import com.adoptacat.backend.mapper.AdoptionProfileMapper;
import com.adoptacat.backend.model.AdoptionProfile;
import com.adoptacat.backend.service.AdoptionProfileService;
import com.adoptacat.backend.util.AdoptaCatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controlador para manejo de perfiles de adopción
 */
@RestController
@RequestMapping("/api/adoption-profiles")
@CrossOrigin(origins = "http://localhost:4200")
public class AdoptionProfileController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdoptionProfileController.class);
    private static final String SUCCESS_MESSAGE = "success";
    private static final String ERROR_MESSAGE = "error";
    private static final String DATA_KEY = "data";
    private static final String MESSAGE_KEY = "message";
    private static final String STATUS_KEY = "status";
    private static final String ERROR_INTERNO_SERVIDOR = "Error interno del servidor";
    
    private final AdoptionProfileService adoptionProfileService;
    private final AdoptionProfileMapper profileMapper;
    private final AdoptaCatUtils utils;
    
    public AdoptionProfileController(AdoptionProfileService adoptionProfileService,
                                   AdoptionProfileMapper profileMapper,
                                   AdoptaCatUtils utils) {
        this.adoptionProfileService = adoptionProfileService;
        this.profileMapper = profileMapper;
        this.utils = utils;
    }
    
    /**
     * Endpoint de prueba para verificar conectividad
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testConnection() {
        Map<String, Object> response = new HashMap<>();
        response.put(STATUS_KEY, SUCCESS_MESSAGE);
        response.put(MESSAGE_KEY, "Conexión exitosa con el backend");
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crear o actualizar perfil de adopción
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrUpdateProfile(@Valid @RequestBody AdoptionProfileDTO profileDTO) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.info("Solicitud para crear/actualizar perfil de adopción para: {}", profileDTO.getCorreoElectronico());
            logger.info("Datos recibidos - cuantasPersonasCasa: {}, tipo: {}", 
                profileDTO.getCuantasPersonasCasa(), 
                profileDTO.getCuantasPersonasCasa() != null ? profileDTO.getCuantasPersonasCasa().getClass().getSimpleName() : "null");
            
            // Convertir DTO a entidad
            AdoptionProfile profile = profileMapper.toEntity(profileDTO);
            
            AdoptionProfile savedProfile = adoptionProfileService.saveProfile(profile);
            
            response.put(STATUS_KEY, SUCCESS_MESSAGE);
            response.put(MESSAGE_KEY, "Perfil de adopción guardado exitosamente");
            response.put(DATA_KEY, savedProfile);
            
            utils.logAuditAction("PROFILE_CREATED_UPDATED", "USER", 
                "Perfil de adopción guardado para: " + profileDTO.getCorreoElectronico());
            
            return ResponseEntity.ok(response);
            
        } catch (AdoptionProfileService.ProfileServiceException e) {
            logger.error("Error del servicio al guardar perfil", e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, e.getMessage());
            
            utils.logSecurityEvent("PROFILE_SAVE_ERROR", "SYSTEM", 
                "Error al guardar perfil: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            logger.error("Error inesperado al guardar perfil", e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, ERROR_INTERNO_SERVIDOR);
            
            utils.logSecurityEvent("PROFILE_SAVE_ERROR", "SYSTEM", 
                "Error inesperado al guardar perfil: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Obtener perfil por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProfileById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.debug("Solicitud para obtener perfil con ID: {}", id);
            
            Optional<AdoptionProfile> profileOpt = adoptionProfileService.findById(id);
            
            if (profileOpt.isPresent()) {
                response.put(STATUS_KEY, SUCCESS_MESSAGE);
                response.put(DATA_KEY, profileOpt.get());
                return ResponseEntity.ok(response);
            } else {
                response.put(STATUS_KEY, ERROR_MESSAGE);
                response.put(MESSAGE_KEY, "Perfil no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("Error al obtener perfil por ID: {}", id, e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, ERROR_INTERNO_SERVIDOR);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Obtener perfil por email
     */
    @GetMapping("/by-email/{email}")
    public ResponseEntity<Map<String, Object>> getProfileByEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.debug("Solicitud para obtener perfil con email: {}", email);
            
            Optional<AdoptionProfile> profileOpt = adoptionProfileService.findByEmail(email);
            
            if (profileOpt.isPresent()) {
                response.put(STATUS_KEY, SUCCESS_MESSAGE);
                response.put(DATA_KEY, profileOpt.get());
                return ResponseEntity.ok(response);
            } else {
                response.put(STATUS_KEY, ERROR_MESSAGE);
                response.put(MESSAGE_KEY, "Perfil no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("Error al obtener perfil por email: {}", email, e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Error interno del servidor");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Obtener todos los perfiles (para administradores)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProfiles() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.debug("Solicitud para obtener todos los perfiles");
            
            List<AdoptionProfile> profiles = adoptionProfileService.getAllProfiles();
            
            response.put(STATUS_KEY, SUCCESS_MESSAGE);
            response.put(DATA_KEY, profiles);
            response.put("total", profiles.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al obtener todos los perfiles", e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Error interno del servidor");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Obtener perfiles por status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getProfilesByStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.debug("Solicitud para obtener perfiles con status: {}", status);
            
            AdoptionProfile.ProfileStatus profileStatus = AdoptionProfile.ProfileStatus.valueOf(status.toUpperCase());
            List<AdoptionProfile> profiles = adoptionProfileService.getProfilesByStatus(profileStatus);
            
            response.put(STATUS_KEY, SUCCESS_MESSAGE);
            response.put(DATA_KEY, profiles);
            response.put("total", profiles.size());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            logger.error("Status inválido: {}", status, e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Status inválido: " + status);
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            logger.error("Error al obtener perfiles por status: {}", status, e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Error interno del servidor");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Obtener perfiles pendientes de revisión
     */
    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getPendingProfiles() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.debug("Solicitud para obtener perfiles pendientes");
            
            List<AdoptionProfile> profiles = adoptionProfileService.getPendingProfiles();
            
            response.put(STATUS_KEY, SUCCESS_MESSAGE);
            response.put(DATA_KEY, profiles);
            response.put("total", profiles.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al obtener perfiles pendientes", e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Error interno del servidor");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Actualizar status del perfil
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateProfileStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String statusStr = request.get("status");
            if (statusStr == null || statusStr.trim().isEmpty()) {
                response.put(STATUS_KEY, ERROR_MESSAGE);
                response.put(MESSAGE_KEY, "Status es requerido");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            logger.info("Actualizando status del perfil {} a {}", id, statusStr);
            
            AdoptionProfile.ProfileStatus newStatus = AdoptionProfile.ProfileStatus.valueOf(statusStr.toUpperCase());
            AdoptionProfile updatedProfile = adoptionProfileService.updateProfileStatus(id, newStatus);
            
            response.put(STATUS_KEY, SUCCESS_MESSAGE);
            response.put(MESSAGE_KEY, "Status actualizado exitosamente");
            response.put(DATA_KEY, updatedProfile);
            
            utils.logAuditAction("PROFILE_STATUS_UPDATED", "ADMIN", 
                "Status del perfil " + id + " actualizado a " + newStatus);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            logger.error("Status inválido para perfil {}: {}", id, request.get("status"), e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Status inválido");
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (AdoptionProfileService.ProfileServiceException e) {
            logger.error("Error del servicio al actualizar status del perfil {}", id, e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            logger.error("Error inesperado al actualizar status del perfil {}", id, e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Error interno del servidor");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Eliminar perfil
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProfile(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.info("Solicitud para eliminar perfil con ID: {}", id);
            
            adoptionProfileService.deleteProfile(id);
            
            response.put(STATUS_KEY, SUCCESS_MESSAGE);
            response.put(MESSAGE_KEY, "Perfil eliminado exitosamente");
            
            utils.logAuditAction("PROFILE_DELETED", "ADMIN", 
                "Perfil " + id + " eliminado");
            
            return ResponseEntity.ok(response);
            
        } catch (AdoptionProfileService.ProfileServiceException e) {
            logger.error("Error del servicio al eliminar perfil {}", id, e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            logger.error("Error inesperado al eliminar perfil {}", id, e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Error interno del servidor");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Verificar si existe perfil para un email
     */
    @GetMapping("/exists/{email}")
    public ResponseEntity<Map<String, Object>> checkProfileExists(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.debug("Verificando existencia de perfil para email: {}", email);
            
            boolean exists = adoptionProfileService.existsByEmail(email);
            
            response.put(STATUS_KEY, SUCCESS_MESSAGE);
            response.put("exists", exists);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al verificar existencia de perfil para email: {}", email, e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Error interno del servidor");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Obtener estadísticas de perfiles
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getProfileStatistics() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.debug("Obteniendo estadísticas de perfiles");
            
            Map<String, Long> statistics = new HashMap<>();
            statistics.put("pending", adoptionProfileService.countByStatus(AdoptionProfile.ProfileStatus.PENDING));
            statistics.put("approved", adoptionProfileService.countByStatus(AdoptionProfile.ProfileStatus.APPROVED));
            statistics.put("rejected", adoptionProfileService.countByStatus(AdoptionProfile.ProfileStatus.REJECTED));
            statistics.put("under_review", adoptionProfileService.countByStatus(AdoptionProfile.ProfileStatus.UNDER_REVIEW));
            
            response.put(STATUS_KEY, SUCCESS_MESSAGE);
            response.put(DATA_KEY, statistics);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al obtener estadísticas de perfiles", e);
            response.put(STATUS_KEY, ERROR_MESSAGE);
            response.put(MESSAGE_KEY, "Error interno del servidor");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
