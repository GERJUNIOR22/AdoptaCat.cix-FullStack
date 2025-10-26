package com.adoptacat.backend.controller;

import com.adoptacat.backend.model.AdoptionApplication;
import com.adoptacat.backend.service.AdoptionApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adoption-applications")
@CrossOrigin(origins = "http://localhost:4200")
public class AdoptionApplicationController {
    
    @Autowired
    private AdoptionApplicationService applicationService;
    
    // Crear nueva solicitud de adopción
    @PostMapping
    public ResponseEntity<?> createApplication(@Valid @RequestBody AdoptionApplication application) {
        try {
            AdoptionApplication createdApplication = applicationService.createApplication(application);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdApplication);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Obtener todas las solicitudes (Admin)
    @GetMapping
    public ResponseEntity<Page<AdoptionApplication>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        Page<AdoptionApplication> applications = applicationService.getApplications(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(applications);
    }
    
    // Obtener solicitud por ID
    @GetMapping("/{id}")
    public ResponseEntity<AdoptionApplication> getApplicationById(@PathVariable Long id) {
        Optional<AdoptionApplication> application = applicationService.getApplicationById(id);
        
        if (application.isPresent()) {
            return ResponseEntity.ok(application.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Obtener solicitud por número de aplicación
    @GetMapping("/number/{applicationNumber}")
    public ResponseEntity<AdoptionApplication> getApplicationByNumber(@PathVariable String applicationNumber) {
        Optional<AdoptionApplication> application = applicationService.getApplicationByNumber(applicationNumber);
        
        if (application.isPresent()) {
            return ResponseEntity.ok(application.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Obtener solicitudes por estado
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<AdoptionApplication>> getApplicationsByStatus(
            @PathVariable AdoptionApplication.ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        Page<AdoptionApplication> applications = applicationService.getApplicationsByStatus(
            status, page, size, sortBy, sortDirection
        );
        return ResponseEntity.ok(applications);
    }
    
    // Obtener solicitudes para un gato específico
    @GetMapping("/cat/{catId}")
    public ResponseEntity<?> getApplicationsForCat(@PathVariable String catId) {
        try {
            List<AdoptionApplication> applications = applicationService.getApplicationsForCat(catId);
            return ResponseEntity.ok(applications);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Obtener solicitudes por email del solicitante
    @GetMapping("/user/{email}")
    public ResponseEntity<List<AdoptionApplication>> getApplicationsByEmail(@PathVariable String email) {
        List<AdoptionApplication> applications = applicationService.getApplicationsByEmail(email);
        return ResponseEntity.ok(applications);
    }
    
    // Buscar solicitudes con filtros
    @GetMapping("/search")
    public ResponseEntity<Page<AdoptionApplication>> searchApplications(
            @RequestParam(required = false) AdoptionApplication.ApplicationStatus status,
            @RequestParam(required = false) Boolean hasVetResources,
            @RequestParam(required = false) Boolean hasChildren,
            @RequestParam(required = false) Boolean acceptsVisits,
            @RequestParam(required = false) Boolean hadPreviousPets,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        Page<AdoptionApplication> applications = applicationService.searchApplicationsWithFilters(
            status, hasVetResources, hasChildren, acceptsVisits, hadPreviousPets, city,
            page, size, sortBy, sortDirection
        );
        return ResponseEntity.ok(applications);
    }
    
    // Aprobar solicitud (Admin)
    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveApplication(
            @PathVariable Long id,
            @RequestBody(required = false) AdminActionRequest request) {
        try {
            String adminNotes = request != null ? request.getNotes() : null;
            AdoptionApplication updatedApplication = applicationService.approveApplication(id, adminNotes);
            return ResponseEntity.ok(updatedApplication);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Rechazar solicitud (Admin)
    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectApplication(
            @PathVariable Long id,
            @RequestBody(required = false) AdminActionRequest request) {
        try {
            String adminNotes = request != null ? request.getNotes() : null;
            AdoptionApplication updatedApplication = applicationService.rejectApplication(id, adminNotes);
            return ResponseEntity.ok(updatedApplication);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Poner solicitud en revisión (Admin)
    @PatchMapping("/{id}/under-review")
    public ResponseEntity<?> setUnderReview(
            @PathVariable Long id,
            @RequestBody(required = false) AdminActionRequest request) {
        try {
            String adminNotes = request != null ? request.getNotes() : null;
            AdoptionApplication updatedApplication = applicationService.setUnderReview(id, adminNotes);
            return ResponseEntity.ok(updatedApplication);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Cancelar solicitud
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelApplication(
            @PathVariable Long id,
            @RequestBody(required = false) AdminActionRequest request) {
        try {
            String reason = request != null ? request.getNotes() : "Cancelado por el usuario";
            AdoptionApplication updatedApplication = applicationService.cancelApplication(id, reason);
            return ResponseEntity.ok(updatedApplication);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Actualizar solicitud
    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody AdoptionApplication applicationDetails) {
        try {
            AdoptionApplication updatedApplication = applicationService.updateApplication(id, applicationDetails);
            return ResponseEntity.ok(updatedApplication);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Eliminar solicitud (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        try {
            applicationService.deleteApplication(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Obtener estadísticas de solicitudes
    @GetMapping("/stats")
    public ResponseEntity<ApplicationStats> getApplicationStats() {
        ApplicationStats stats = new ApplicationStats(
            applicationService.countApplicationsByStatus(AdoptionApplication.ApplicationStatus.PENDING),
            applicationService.countApplicationsByStatus(AdoptionApplication.ApplicationStatus.UNDER_REVIEW),
            applicationService.countApplicationsByStatus(AdoptionApplication.ApplicationStatus.APPROVED),
            applicationService.countApplicationsByStatus(AdoptionApplication.ApplicationStatus.REJECTED),
            applicationService.countApplicationsByStatus(AdoptionApplication.ApplicationStatus.CANCELLED)
        );
        return ResponseEntity.ok(stats);
    }
    
    // Verificar si un usuario ya aplicó para un gato
    @GetMapping("/check/{catId}/{email}")
    public ResponseEntity<Boolean> hasUserAppliedForCat(
            @PathVariable String catId,
            @PathVariable String email) {
        boolean hasApplied = applicationService.hasUserAppliedForCat(catId, email);
        return ResponseEntity.ok(hasApplied);
    }
    
    // Obtener solicitudes pendientes más antiguas
    @GetMapping("/pending/oldest")
    public ResponseEntity<List<AdoptionApplication>> getOldestPendingApplications() {
        List<AdoptionApplication> applications = applicationService.getOldestPendingApplications();
        return ResponseEntity.ok(applications);
    }
    
    // Obtener estadísticas por mes
    @GetMapping("/stats/monthly")
    public ResponseEntity<List<Object[]>> getMonthlyStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate) : LocalDateTime.now().minusYears(1);
        LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate) : LocalDateTime.now();
        
        List<Object[]> stats = applicationService.getApplicationStatsByMonth(start, end);
        return ResponseEntity.ok(stats);
    }
    
    // Clases auxiliares
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
    }
    
    public static class AdminActionRequest {
        private String notes;
        
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
    
    public static class ApplicationStats {
        private long pending;
        private long underReview;
        private long approved;
        private long rejected;
        private long cancelled;
        
        public ApplicationStats(long pending, long underReview, long approved, long rejected, long cancelled) {
            this.pending = pending;
            this.underReview = underReview;
            this.approved = approved;
            this.rejected = rejected;
            this.cancelled = cancelled;
        }
        
        // Getters
        public long getPending() { return pending; }
        public long getUnderReview() { return underReview; }
        public long getApproved() { return approved; }
        public long getRejected() { return rejected; }
        public long getCancelled() { return cancelled; }
        public long getTotal() { return pending + underReview + approved + rejected + cancelled; }
    }
}