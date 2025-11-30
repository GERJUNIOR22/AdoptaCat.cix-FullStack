package com.adoptacat.backend.service;

import com.adoptacat.backend.model.AdoptionApplication;
import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.repository.AdoptionApplicationRepository;
import com.adoptacat.backend.repository.CatRepository;
import com.adoptacat.backend.util.AdoptaCatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final String ADMIN_USER = "ADMIN";
    
    private final AdoptionApplicationRepository applicationRepository;
    private final CatRepository catRepository;
    private final AdoptaCatUtils utils;
    
    public AdoptionApplicationService(AdoptionApplicationRepository applicationRepository, 
                                    CatRepository catRepository, 
                                    AdoptaCatUtils utils) {
        this.applicationRepository = applicationRepository;
        this.catRepository = catRepository;
        this.utils = utils;
    }
    
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
    public Page<AdoptionApplication> searchApplicationsWithFilters(ApplicationSearchFilters filters, 
            int page, int size, String sortBy, String sortDirection) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return applicationRepository.findApplicationsWithFilters(
            filters.getStatus(), filters.getHasVetResources(), filters.getHasChildren(), 
            filters.getAcceptsVisits(), filters.getHadPreviousPets(), filters.getCity(), pageable
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
            
            utils.logAuditAction("APPROVE_APPLICATION", ADMIN_USER, 
                "Solicitud " + application.getApplicationNumber() + " aprobada para gato " + cat.getId());
        }
        
        AdoptionApplication savedApplication = applicationRepository.save(application);
        
        utils.logAuditAction("UPDATE_APPLICATION_STATUS", ADMIN_USER, 
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

    // ============================================
    // MÉTODOS PARA ADMINISTRACIÓN
    // ============================================

    /**
     * Contar todas las solicitudes
     */
    public long countAllApplications() {
        return applicationRepository.count();
    }

    /**
     * Obtener estadísticas de adopciones por mes
     */
    public List<Object[]> getAdoptionStatsByMonth() {
        // Implementación simplificada - en producción usar query más compleja
        return new java.util.ArrayList<>();
    }

    /**
     * Obtener solicitudes recientes
     */
    public List<AdoptionApplication> getRecentApplications(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        return applicationRepository.findAll(pageable).getContent();
    }

    /**
     * Búsqueda avanzada de solicitudes
     */
    public Page<AdoptionApplication> advancedSearch(AdvancedSearchParams searchParams, 
            int page, int size, String sortBy, String sortDirection) {
        
        try {
            Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);
            
            // Implementación simplificada - en producción usar Specification pattern
            if (searchParams.getStatus() != null) {
                return applicationRepository.findByStatus(searchParams.getStatus(), pageable);
            } else {
                return applicationRepository.findAll(pageable);
            }
            
        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            // Log detallado del error con contexto completo
            logger.error("Error en búsqueda avanzada de solicitudes de adopción. Parámetros: {}. Error: {}", 
                searchParams, e.getMessage(), e);
            throw new ApplicationSearchException("Error en búsqueda avanzada", e);
        }
    }

    /**
     * Procesar solicitudes en lote
     */
    public void batchProcess(List<Long> applicationIds, String action, String notes) {
        try {
            for (Long applicationId : applicationIds) {
                Optional<AdoptionApplication> appOpt = applicationRepository.findById(applicationId);
                if (appOpt.isPresent()) {
                    AdoptionApplication app = appOpt.get();
                    
                    switch (action.toLowerCase()) {
                        case "approve":
                            app.setStatus(AdoptionApplication.ApplicationStatus.APPROVED);
                            break;
                        case "reject":
                            app.setStatus(AdoptionApplication.ApplicationStatus.REJECTED);
                            break;
                        case "under_review":
                            app.setStatus(AdoptionApplication.ApplicationStatus.UNDER_REVIEW);
                            break;
                        default:
                            throw new IllegalArgumentException("Acción no válida: " + action);
                    }
                    
                    if (notes != null && !notes.trim().isEmpty()) {
                        app.setAdminNotes(notes);
                    }
                    app.setReviewDate(LocalDateTime.now());
                    
                    applicationRepository.save(app);
                }
            }
            
            utils.logAuditAction("BATCH_APPLICATION_PROCESS", ADMIN_USER, 
                String.format("Procesadas %d solicitudes con acción: %s", applicationIds.size(), action));
                
        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            // Log detallado del error con contexto específico del procesamiento masivo
            logger.error("Error en procesamiento masivo de {} solicitudes con acción {}. Error: {}", 
                applicationIds.size(), action, e.getMessage(), e);
            throw new ApplicationProcessingException("Error en procesamiento masivo", e);
        }
    }

    /**
     * Excepciones personalizadas para el servicio de aplicaciones de adopción
     */
    public static class ApplicationServiceException extends RuntimeException {
        public ApplicationServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class ApplicationSearchException extends ApplicationServiceException {
        public ApplicationSearchException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class ApplicationProcessingException extends ApplicationServiceException {
        public ApplicationProcessingException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    /**
     * Clase para encapsular filtros de búsqueda de aplicaciones
     */
    public static class ApplicationSearchFilters {
        private AdoptionApplication.ApplicationStatus status;
        private Boolean hasVetResources;
        private Boolean hasChildren;
        private Boolean acceptsVisits;
        private Boolean hadPreviousPets;
        private String city;

        public ApplicationSearchFilters(AdoptionApplication.ApplicationStatus status, Boolean hasVetResources,
                Boolean hasChildren, Boolean acceptsVisits, Boolean hadPreviousPets, String city) {
            this.status = status;
            this.hasVetResources = hasVetResources;
            this.hasChildren = hasChildren;
            this.acceptsVisits = acceptsVisits;
            this.hadPreviousPets = hadPreviousPets;
            this.city = city;
        }

        public AdoptionApplication.ApplicationStatus getStatus() { return status; }
        public Boolean getHasVetResources() { return hasVetResources; }
        public Boolean getHasChildren() { return hasChildren; }
        public Boolean getAcceptsVisits() { return acceptsVisits; }
        public Boolean getHadPreviousPets() { return hadPreviousPets; }
        public String getCity() { return city; }
    }

    /**
     * Clase para encapsular parámetros de búsqueda avanzada
     */
    public static class AdvancedSearchParams {
        private AdoptionApplication.ApplicationStatus status;
        private String applicantName;
        private String applicantEmail;
        private String catName;
        private String city;
        private String dateFrom;
        private String dateTo;

        public AdvancedSearchParams(AdoptionApplication.ApplicationStatus status, String applicantName,
                String applicantEmail, String catName, String city, String dateFrom, String dateTo) {
            this.status = status;
            this.applicantName = applicantName;
            this.applicantEmail = applicantEmail;
            this.catName = catName;
            this.city = city;
            this.dateFrom = dateFrom;
            this.dateTo = dateTo;
        }

        public AdoptionApplication.ApplicationStatus getStatus() { return status; }
        public String getApplicantName() { return applicantName; }
        public String getApplicantEmail() { return applicantEmail; }
        public String getCatName() { return catName; }
        public String getCity() { return city; }
        public String getDateFrom() { return dateFrom; }
        public String getDateTo() { return dateTo; }

        @Override
        public String toString() {
            return "AdvancedSearchParams{" +
                    "status=" + status +
                    ", applicantName='" + applicantName + '\'' +
                    ", applicantEmail='" + applicantEmail + '\'' +
                    ", catName='" + catName + '\'' +
                    ", city='" + city + '\'' +
                    ", dateFrom='" + dateFrom + '\'' +
                    ", dateTo='" + dateTo + '\'' +
                    '}';
        }
    }
}