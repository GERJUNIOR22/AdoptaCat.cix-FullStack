package com.adoptacat.backend.controller;

import com.adoptacat.backend.model.User;
import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.model.AdoptionApplication;
import com.adoptacat.backend.service.UserService;
import com.adoptacat.backend.service.CatService;
import com.adoptacat.backend.service.AdoptionApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controlador para la administración del sistema AdoptaCat
 * Requiere rol ADMIN para acceder a todos los endpoints
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final CatService catService;
    private final AdoptionApplicationService applicationService;

    public AdminController(UserService userService, CatService catService, AdoptionApplicationService applicationService) {
        this.userService = userService;
        this.catService = catService;
        this.applicationService = applicationService;
    }

    // ============================================
    // DASHBOARD Y ESTADÍSTICAS GENERALES
    // ============================================

    /**
     * Obtener estadísticas generales del dashboard
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        try {
            DashboardStats stats = new DashboardStats();
            
            // Estadísticas de gatos
            stats.totalCats = catService.countAllCats();
            stats.availableCats = catService.countAvailableCats();
            stats.adoptedCats = catService.countAdoptedCats();
            stats.pendingCats = catService.countPendingCats();
            
            // Estadísticas de solicitudes
            stats.totalApplications = applicationService.countAllApplications();
            stats.pendingApplications = applicationService.countApplicationsByStatus(AdoptionApplication.ApplicationStatus.PENDING);
            stats.approvedApplications = applicationService.countApplicationsByStatus(AdoptionApplication.ApplicationStatus.APPROVED);
            stats.rejectedApplications = applicationService.countApplicationsByStatus(AdoptionApplication.ApplicationStatus.REJECTED);
            
            // Estadísticas de usuarios
            stats.totalUsers = userService.countAllUsers();
            stats.activeUsers = userService.countActiveUsers();
            stats.adminUsers = userService.countAdminUsers();
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener estadísticas de adopciones por mes
     */
    @GetMapping("/dashboard/adoptions-by-month")
    public ResponseEntity<List<MonthlyAdoptionStats>> getAdoptionsByMonth() {
        try {
            List<Object[]> rawStats = applicationService.getAdoptionStatsByMonth();
            List<MonthlyAdoptionStats> stats = rawStats.stream()
                .map(row -> new MonthlyAdoptionStats(
                    (String) row[0], // month
                    ((Number) row[1]).longValue() // count
                ))
                .toList();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener actividad reciente del sistema
     */
    @GetMapping("/dashboard/recent-activity")
    public ResponseEntity<RecentActivityStats> getRecentActivity() {
        try {
            RecentActivityStats activity = new RecentActivityStats();
            
            // Solicitudes recientes
            activity.recentApplications = applicationService.getRecentApplications(5);
            
            // Gatos agregados recientemente
            activity.recentCats = catService.getRecentlyAddedCats(5);
            
            // Usuarios registrados recientemente
            activity.recentUsers = userService.getRecentUsers(5);
            
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============================================
    // GESTIÓN DE USUARIOS
    // ============================================

    /**
     * Obtener todos los usuarios con paginación
     */
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        Page<User> users = userService.getAllUsers(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(users);
    }

    /**
     * Obtener usuario por ID
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crear nuevo usuario
     */
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar usuario
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cambiar rol de usuario
     */
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<User> changeUserRole(@PathVariable Long id, @RequestBody RoleChangeRequest request) {
        try {
            User updatedUser = userService.changeUserRole(id, request.getRole());
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Activar/Desactivar usuario
     */
    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        try {
            User updatedUser = userService.toggleUserStatus(id);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Eliminar usuario
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ============================================
    // GESTIÓN AVANZADA DE GATOS
    // ============================================

    /**
     * Obtener todos los gatos (incluidos no disponibles) con paginación
     */
    @GetMapping("/cats")
    public ResponseEntity<Page<Cat>> getAllCatsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) Cat.AdoptionStatus status) {
        
        Page<Cat> cats = catService.getAllCatsForAdmin(page, size, sortBy, sortDirection, status);
        return ResponseEntity.ok(cats);
    }

    /**
     * Cambiar estado de adopción de un gato en lote
     */
    @PatchMapping("/cats/batch-status")
    public ResponseEntity<Void> batchUpdateCatStatus(@RequestBody BatchStatusUpdateRequest request) {
        try {
            catService.batchUpdateStatus(request.getCatIds(), request.getStatus());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ============================================
    // GESTIÓN AVANZADA DE SOLICITUDES
    // ============================================

    /**
     * Buscar solicitudes con filtros avanzados
     */
    @GetMapping("/applications/advanced-search")
    public ResponseEntity<Page<AdoptionApplication>> advancedSearchApplications(
            @RequestParam(required = false) AdoptionApplication.ApplicationStatus status,
            @RequestParam(required = false) String applicantName,
            @RequestParam(required = false) String applicantEmail,
            @RequestParam(required = false) String catName,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        AdoptionApplicationService.AdvancedSearchParams searchParams = 
            new AdoptionApplicationService.AdvancedSearchParams(
                status, applicantName, applicantEmail, catName, city, dateFrom, dateTo
            );
        
        Page<AdoptionApplication> applications = applicationService.advancedSearch(
            searchParams, page, size, sortBy, sortDirection
        );
        return ResponseEntity.ok(applications);
    }

    /**
     * Procesar solicitudes en lote
     */
    @PatchMapping("/applications/batch-process")
    public ResponseEntity<Void> batchProcessApplications(@RequestBody BatchProcessRequest request) {
        try {
            applicationService.batchProcess(request.getApplicationIds(), request.getAction(), request.getNotes());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ============================================
    // CONFIGURACIÓN DEL SISTEMA
    // ============================================

    /**
     * Obtener configuraciones del sistema
     */
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSystemSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("maxApplicationsPerUser", 3);
        settings.put("autoApprovalEnabled", false);
        settings.put("notificationsEnabled", true);
        settings.put("maintenanceMode", false);
        return ResponseEntity.ok(settings);
    }

    /**
     * Actualizar configuraciones del sistema
     */
    @PutMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSystemSettings(@RequestBody Map<String, Object> settings) {
        // Aquí implementarías la lógica para guardar las configuraciones
        return ResponseEntity.ok(settings);
    }

    // ============================================
    // CLASES INTERNAS PARA RESPONSES
    // ============================================

    public static class DashboardStats {
        private Long totalCats;
        private Long availableCats;
        private Long adoptedCats;
        private Long pendingCats;
        private Long totalApplications;
        private Long pendingApplications;
        private Long approvedApplications;
        private Long rejectedApplications;
        private Long totalUsers;
        private Long activeUsers;
        private Long adminUsers;

        // Getters y setters
        public Long getTotalCats() { return totalCats; }
        public void setTotalCats(Long totalCats) { this.totalCats = totalCats; }
        
        public Long getAvailableCats() { return availableCats; }
        public void setAvailableCats(Long availableCats) { this.availableCats = availableCats; }
        
        public Long getAdoptedCats() { return adoptedCats; }
        public void setAdoptedCats(Long adoptedCats) { this.adoptedCats = adoptedCats; }
        
        public Long getPendingCats() { return pendingCats; }
        public void setPendingCats(Long pendingCats) { this.pendingCats = pendingCats; }
        
        public Long getTotalApplications() { return totalApplications; }
        public void setTotalApplications(Long totalApplications) { this.totalApplications = totalApplications; }
        
        public Long getPendingApplications() { return pendingApplications; }
        public void setPendingApplications(Long pendingApplications) { this.pendingApplications = pendingApplications; }
        
        public Long getApprovedApplications() { return approvedApplications; }
        public void setApprovedApplications(Long approvedApplications) { this.approvedApplications = approvedApplications; }
        
        public Long getRejectedApplications() { return rejectedApplications; }
        public void setRejectedApplications(Long rejectedApplications) { this.rejectedApplications = rejectedApplications; }
        
        public Long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
        
        public Long getActiveUsers() { return activeUsers; }
        public void setActiveUsers(Long activeUsers) { this.activeUsers = activeUsers; }
        
        public Long getAdminUsers() { return adminUsers; }
        public void setAdminUsers(Long adminUsers) { this.adminUsers = adminUsers; }
    }

    public static class MonthlyAdoptionStats {
        private String month;
        private Long adoptions;
        
        public MonthlyAdoptionStats(String month, Long adoptions) {
            this.month = month;
            this.adoptions = adoptions;
        }
        
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        
        public Long getAdoptions() { return adoptions; }
        public void setAdoptions(Long adoptions) { this.adoptions = adoptions; }
    }

    public static class RecentActivityStats {
        private List<AdoptionApplication> recentApplications;
        private List<Cat> recentCats;
        private List<User> recentUsers;
        
        public List<AdoptionApplication> getRecentApplications() { return recentApplications; }
        public void setRecentApplications(List<AdoptionApplication> recentApplications) { this.recentApplications = recentApplications; }
        
        public List<Cat> getRecentCats() { return recentCats; }
        public void setRecentCats(List<Cat> recentCats) { this.recentCats = recentCats; }
        
        public List<User> getRecentUsers() { return recentUsers; }
        public void setRecentUsers(List<User> recentUsers) { this.recentUsers = recentUsers; }
    }

    public static class RoleChangeRequest {
        private User.Role role;
        
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }

    public static class BatchStatusUpdateRequest {
        private List<String> catIds;
        private Cat.AdoptionStatus status;
        
        public List<String> getCatIds() { return catIds; }
        public void setCatIds(List<String> catIds) { this.catIds = catIds; }
        
        public Cat.AdoptionStatus getStatus() { return status; }
        public void setStatus(Cat.AdoptionStatus status) { this.status = status; }
    }

    public static class BatchProcessRequest {
        private List<Long> applicationIds;
        private String action; // "approve", "reject", "under_review"
        private String notes;
        
        public List<Long> getApplicationIds() { return applicationIds; }
        public void setApplicationIds(List<Long> applicationIds) { this.applicationIds = applicationIds; }
        
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}