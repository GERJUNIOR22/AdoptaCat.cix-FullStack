package com.adoptacat.backend.service;

import com.adoptacat.backend.model.AdoptionApplication;
import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.repository.AdoptionApplicationRepository;
import com.adoptacat.backend.repository.CatRepository;
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
    
    @Autowired
    private AdoptionApplicationRepository applicationRepository;
    
    @Autowired
    private CatRepository catRepository;
    
    // Crear nueva solicitud de adopción
    public AdoptionApplication createApplication(AdoptionApplication application) {
        // Verificar que el gato existe y está disponible
        Optional<Cat> catOpt = catRepository.findById(application.getCat().getId());
        if (catOpt.isEmpty()) {
            throw new IllegalArgumentException("El gato especificado no existe");
        }
        
        Cat cat = catOpt.get();
        if (cat.getAdoptionStatus() != Cat.AdoptionStatus.AVAILABLE) {
            throw new IllegalArgumentException("El gato no está disponible para adopción");
        }
        
        // Verificar que el usuario no haya aplicado previamente para este gato
        if (applicationRepository.hasUserAppliedForCat(cat, application.getEmail())) {
            throw new IllegalArgumentException("Ya has enviado una solicitud para este gato");
        }
        
        // Establecer valores por defecto
        application.setCat(cat);
        application.setStatus(AdoptionApplication.ApplicationStatus.PENDING);
        application.setApplicationNumber(generateApplicationNumber());
        
        return applicationRepository.save(application);
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
        Optional<AdoptionApplication> appOpt = applicationRepository.findById(id);
        
        if (appOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la solicitud con ID: " + id);
        }
        
        AdoptionApplication application = appOpt.get();
        application.setStatus(newStatus);
        application.setAdminNotes(adminNotes);
        application.setReviewDate(LocalDateTime.now());
        
        // Si la solicitud es aprobada, marcar el gato como pendiente
        if (newStatus == AdoptionApplication.ApplicationStatus.APPROVED) {
            Cat cat = application.getCat();
            cat.setAdoptionStatus(Cat.AdoptionStatus.PENDING);
            catRepository.save(cat);
        }
        
        return applicationRepository.save(application);
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
    
    // Método privado para generar número de aplicación
    private String generateApplicationNumber() {
        String prefix = "APP";
        long timestamp = System.currentTimeMillis();
        return prefix + timestamp;
    }
}