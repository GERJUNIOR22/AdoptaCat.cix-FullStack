package com.adoptacat.backend.service;

import com.adoptacat.backend.model.AdoptionApplication;
import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.repository.AdoptionApplicationRepository;
import com.adoptacat.backend.repository.CatRepository;
import com.adoptacat.backend.util.AdoptaCatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdoptionApplicationService {
    
    private static final Logger logger = LoggerFactory.getLogger(AdoptionApplicationService.class);
    
    @Autowired
    private AdoptionApplicationRepository applicationRepository;
    
    @Autowired
    private CatRepository catRepository;
    
    @Autowired
    private AdoptaCatUtils utils;
    
    // Crear nueva solicitud de adopción
    public AdoptionApplication createApplication(AdoptionApplication application) {
        logger.info("Creando nueva solicitud de adopción para gato: {}", application.getCat().getId());
        
        // Validar y sanitizar datos usando las utilidades
        if (application.getFullName() != null) {
            application.setFullName(utils.validateAndSanitizeName(application.getFullName()));
        }
        
        if (application.getEmail() != null) {
            application.setEmail(utils.validateAndSanitizeEmail(application.getEmail()));
        }
        
        if (application.getPhone() != null) {
            application.setPhone(utils.validateAndSanitizePhone(application.getPhone()));
        }
        
        // Sanitizar campos de texto libre
        if (application.getWhyAdopt() != null) {
            application.setWhyAdopt(utils.validateAndSanitizeText(application.getWhyAdopt()));
        }
        
        if (application.getCurrentPetsDetails() != null) {
            application.setCurrentPetsDetails(utils.validateAndSanitizeText(application.getCurrentPetsDetails()));
        }
        
        if (application.getPreviousPetsDetails() != null) {
            application.setPreviousPetsDetails(utils.validateAndSanitizeText(application.getPreviousPetsDetails()));
        }
        
        // Verificar que el gato existe y está disponible
        Optional<Cat> catOpt = catRepository.findById(application.getCat().getId());
        if (catOpt.isEmpty()) {
            logger.warn("Intento de solicitud para gato inexistente: {}", application.getCat().getId());
            throw new IllegalArgumentException("El gato especificado no existe");
        }
        
        Cat cat = catOpt.get();
        if (cat.getAdoptionStatus() != Cat.AdoptionStatus.AVAILABLE) {
            logger.warn("Intento de solicitud para gato no disponible: {}", cat.getId());
            throw new IllegalArgumentException("El gato no está disponible para adopción");
        }
        
        // Verificar que el usuario no haya aplicado previamente para este gato
        if (applicationRepository.hasUserAppliedForCat(cat, application.getEmail())) {
            logger.warn("Usuario {} ya aplicó para el gato {}", application.getEmail(), cat.getId());
            throw new IllegalArgumentException("Ya has enviado una solicitud para este gato");
        }
        
        // Establecer valores por defecto
        application.setCat(cat);
        application.setStatus(AdoptionApplication.ApplicationStatus.PENDING);
        application.setApplicationNumber(utils.generateApplicationNumber());
        
        AdoptionApplication savedApplication = applicationRepository.save(application);
        
        utils.logAuditAction("CREATE_APPLICATION", application.getEmail(), 
            "Solicitud creada para gato: " + cat.getId());
        
        logger.info("Solicitud de adopción creada exitosamente: {}", savedApplication.getApplicationNumber());
        
        return savedApplication;
    }
    
    // Obtener todas las solicitudes
    public List<AdoptionApplication> getAllApplications() {
        return applicationRepository.findAll();
    }
    
    // Obtener solicitudes con paginación
    public Page<AdoptionApplication> getApplications(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return applicationRepository.findAll(pageable);
    }
    
    // Obtener solicitud por ID
    public Optional<AdoptionApplication> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }
    
    // Obtener solicitud por número de aplicación
    public Optional<AdoptionApplication> getApplicationByNumber(String applicationNumber) {
        return applicationRepository.findByApplicationNumber(applicationNumber);
    }
    
    // Obtener solicitudes por estado
    public List<AdoptionApplication> getApplicationsByStatus(AdoptionApplication.ApplicationStatus status) {
        return applicationRepository.findByStatus(status);
    }
    
    // Obtener solicitudes por estado con paginación
    public Page<AdoptionApplication> getApplicationsByStatus(
            AdoptionApplication.ApplicationStatus status, 
            int page, 
            int size, 
            String sortBy, 
            String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return applicationRepository.findByStatus(status, pageable);
    }
    
    // Obtener solicitudes para un gato específico
    public List<AdoptionApplication> getApplicationsForCat(String catId) {
        Optional<Cat> catOpt = catRepository.findById(catId);
        if (catOpt.isEmpty()) {
            throw new IllegalArgumentException("El gato especificado no existe");
        }
        return applicationRepository.findByCat(catOpt.get());
    }
    
    // Obtener solicitudes por email del solicitante
    public List<AdoptionApplication> getApplicationsByEmail(String email) {
        return applicationRepository.findByEmailIgnoreCase(email);
    }
    
    // Buscar solicitudes con filtros
    public Page<AdoptionApplication> searchApplicationsWithFilters(
            AdoptionApplication.ApplicationStatus status,
            Boolean hasVetResources,
            Boolean hasChildren,
            Boolean acceptsVisits,
            Boolean hadPreviousPets,
            String city,
            int page,
            int size,
            String sortBy,
            String sortDirection) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return applicationRepository.findApplicationsWithFilters(
            status, hasVetResources, hasChildren, acceptsVisits, hadPreviousPets, city, pageable
        );
    }
    
    // Actualizar estado de la solicitud
    public AdoptionApplication updateApplicationStatus(Long id, AdoptionApplication.ApplicationStatus newStatus, String adminNotes) {
        logger.info("Actualizando estado de solicitud {} a {}", id, newStatus);
        
        Optional<AdoptionApplication> appOpt = applicationRepository.findById(id);
        
        if (appOpt.isEmpty()) {
            logger.warn("Intento de actualizar solicitud inexistente: {}", id);
            throw new IllegalArgumentException("No se encontró la solicitud con ID: " + id);
        }
        
        AdoptionApplication application = appOpt.get();
        AdoptionApplication.ApplicationStatus previousStatus = application.getStatus();
        
        application.setStatus(newStatus);
        if (adminNotes != null) {
            application.setAdminNotes(utils.validateAndSanitizeText(adminNotes));
        }
        application.setReviewDate(LocalDateTime.now());
        
        // Si la solicitud es aprobada, marcar el gato como pendiente
        if (newStatus == AdoptionApplication.ApplicationStatus.APPROVED) {
            Cat cat = application.getCat();
            cat.setAdoptionStatus(Cat.AdoptionStatus.PENDING);
            catRepository.save(cat);
            
            utils.logAuditAction("APPROVE_APPLICATION", "ADMIN", 
                "Solicitud " + application.getApplicationNumber() + " aprobada para gato " + cat.getId());
        }
        
        AdoptionApplication savedApplication = applicationRepository.save(application);
        
        utils.logAuditAction("UPDATE_APPLICATION_STATUS", "ADMIN", 
            "Solicitud " + application.getApplicationNumber() + " cambió de " + 
            previousStatus + " a " + newStatus);
        
        logger.info("Estado de solicitud {} actualizado exitosamente de {} a {}", 
            id, previousStatus, newStatus);
        
        return savedApplication;
    }
    
    // Aprobar solicitud
    public AdoptionApplication approveApplication(Long id, String adminNotes) {
        return updateApplicationStatus(id, AdoptionApplication.ApplicationStatus.APPROVED, adminNotes);
    }
    
    // Rechazar solicitud
    public AdoptionApplication rejectApplication(Long id, String adminNotes) {
        return updateApplicationStatus(id, AdoptionApplication.ApplicationStatus.REJECTED, adminNotes);
    }
    
    // Poner solicitud en revisión
    public AdoptionApplication setUnderReview(Long id, String adminNotes) {
        return updateApplicationStatus(id, AdoptionApplication.ApplicationStatus.UNDER_REVIEW, adminNotes);
    }
    
    // Cancelar solicitud
    public AdoptionApplication cancelApplication(Long id, String reason) {
        return updateApplicationStatus(id, AdoptionApplication.ApplicationStatus.CANCELLED, reason);
    }
    
    // Actualizar solicitud completa
    public AdoptionApplication updateApplication(Long id, AdoptionApplication applicationDetails) {
        Optional<AdoptionApplication> appOpt = applicationRepository.findById(id);
        
        if (appOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la solicitud con ID: " + id);
        }
        
        AdoptionApplication existingApp = appOpt.get();
        
        // Solo permitir actualización si está en estado PENDING
        if (existingApp.getStatus() != AdoptionApplication.ApplicationStatus.PENDING) {
            throw new IllegalStateException("Solo se pueden editar solicitudes en estado PENDIENTE");
        }
        
        // Actualizar campos editables
        if (applicationDetails.getPhone() != null) existingApp.setPhone(applicationDetails.getPhone());
        if (applicationDetails.getCity() != null) existingApp.setCity(applicationDetails.getCity());
        if (applicationDetails.getAddress() != null) existingApp.setAddress(applicationDetails.getAddress());
        if (applicationDetails.getDistrict() != null) existingApp.setDistrict(applicationDetails.getDistrict());
        if (applicationDetails.getInstagram() != null) existingApp.setInstagram(applicationDetails.getInstagram());
        if (applicationDetails.getFacebook() != null) existingApp.setFacebook(applicationDetails.getFacebook());
        if (applicationDetails.getWhyAdopt() != null) existingApp.setWhyAdopt(applicationDetails.getWhyAdopt());
        
        return applicationRepository.save(existingApp);
    }
    
    // Eliminar solicitud
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new IllegalArgumentException("No se encontró la solicitud con ID: " + id);
        }
        applicationRepository.deleteById(id);
    }
    
    // Estadísticas
    public long countApplicationsByStatus(AdoptionApplication.ApplicationStatus status) {
        return applicationRepository.countByStatus(status);
    }
    
    public long countApplicationsForCat(String catId) {
        Optional<Cat> catOpt = catRepository.findById(catId);
        if (catOpt.isEmpty()) {
            return 0;
        }
        return applicationRepository.countByCat(catOpt.get());
    }
    
    // Obtener solicitudes pendientes más antiguas
    public List<AdoptionApplication> getOldestPendingApplications() {
        return applicationRepository.findOldestPendingApplications(AdoptionApplication.ApplicationStatus.PENDING);
    }
    
    // Verificar si un usuario ya aplicó para un gato
    public boolean hasUserAppliedForCat(String catId, String email) {
        Optional<Cat> catOpt = catRepository.findById(catId);
        if (catOpt.isEmpty()) {
            return false;
        }
        return applicationRepository.hasUserAppliedForCat(catOpt.get(), email);
    }
    
    // Obtener estadísticas por mes
    public List<Object[]> getApplicationStatsByMonth(LocalDateTime startDate, LocalDateTime endDate) {
        return applicationRepository.getApplicationStatsByMonth(startDate, endDate);
    }
}