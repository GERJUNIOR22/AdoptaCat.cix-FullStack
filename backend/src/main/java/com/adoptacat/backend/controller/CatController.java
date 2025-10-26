package com.adoptacat.backend.controller;

import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.service.CatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cats")
@CrossOrigin(origins = "http://localhost:4200")
public class CatController {
    
    @Autowired
    private CatService catService;
    
    // Obtener todos los gatos disponibles
    @GetMapping("/available")
    public ResponseEntity<List<Cat>> getAllAvailableCats() {
        List<Cat> cats = catService.getAllAvailableCats();
        return ResponseEntity.ok(cats);
    }
    
    // Obtener gatos disponibles con paginación
    @GetMapping
    public ResponseEntity<Page<Cat>> getAvailableCats(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        Page<Cat> cats = catService.getAvailableCats(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(cats);
    }
    
    // Obtener gato por ID
    @GetMapping("/{id}")
    public ResponseEntity<Cat> getCatById(@PathVariable String id) {
        Optional<Cat> cat = catService.getCatById(id);
        
        if (cat.isPresent()) {
            return ResponseEntity.ok(cat.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Obtener gato disponible por ID
    @GetMapping("/available/{id}")
    public ResponseEntity<Cat> getAvailableCatById(@PathVariable String id) {
        Optional<Cat> cat = catService.getAvailableCatById(id);
        
        if (cat.isPresent()) {
            return ResponseEntity.ok(cat.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Obtener gatos destacados
    @GetMapping("/featured")
    public ResponseEntity<List<Cat>> getFeaturedCats() {
        List<Cat> cats = catService.getFeaturedCats();
        return ResponseEntity.ok(cats);
    }
    
    // Obtener gatos recién llegados
    @GetMapping("/recent-arrivals")
    public ResponseEntity<List<Cat>> getRecentArrivals() {
        List<Cat> cats = catService.getRecentArrivals();
        return ResponseEntity.ok(cats);
    }
    
    // Buscar gatos por nombre
    @GetMapping("/search")
    public ResponseEntity<List<Cat>> searchCatsByName(@RequestParam String name) {
        List<Cat> cats = catService.searchCatsByName(name);
        return ResponseEntity.ok(cats);
    }
    
    // Buscar gatos por raza
    @GetMapping("/breed/{breed}")
    public ResponseEntity<List<Cat>> searchCatsByBreed(@PathVariable String breed) {
        List<Cat> cats = catService.searchCatsByBreed(breed);
        return ResponseEntity.ok(cats);
    }
    
    // Buscar gatos con filtros avanzados
    @GetMapping("/filter")
    public ResponseEntity<Page<Cat>> searchCatsWithFilters(
            @RequestParam(required = false) Cat.Gender gender,
            @RequestParam(required = false) Cat.Size size,
            @RequestParam(required = false) Cat.ActivityLevel activityLevel,
            @RequestParam(required = false) Boolean isSpecialNeeds,
            @RequestParam(required = false) Boolean isVaccinated,
            @RequestParam(required = false) Boolean isSterilized,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        Page<Cat> cats = catService.searchCatsWithFilters(
            gender, size, activityLevel, isSpecialNeeds, isVaccinated, isSterilized,
            page, pageSize, sortBy, sortDirection
        );
        return ResponseEntity.ok(cats);
    }
    
    // Crear nuevo gato (Admin)
    @PostMapping
    public ResponseEntity<Cat> createCat(@Valid @RequestBody Cat cat) {
        try {
            Cat createdCat = catService.createCat(cat);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCat);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Actualizar gato (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<Cat> updateCat(@PathVariable String id, @Valid @RequestBody Cat catDetails) {
        try {
            Cat updatedCat = catService.updateCat(id, catDetails);
            return ResponseEntity.ok(updatedCat);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Marcar gato como adoptado (Admin)
    @PatchMapping("/{id}/adopt")
    public ResponseEntity<Cat> markAsAdopted(@PathVariable String id) {
        try {
            Cat updatedCat = catService.markAsAdopted(id);
            return ResponseEntity.ok(updatedCat);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Marcar gato como disponible (Admin)
    @PatchMapping("/{id}/available")
    public ResponseEntity<Cat> markAsAvailable(@PathVariable String id) {
        try {
            Cat updatedCat = catService.markAsAvailable(id);
            return ResponseEntity.ok(updatedCat);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Eliminar gato (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable String id) {
        try {
            catService.deleteCat(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Obtener estadísticas de gatos
    @GetMapping("/stats")
    public ResponseEntity<CatStats> getCatStats() {
        CatStats stats = new CatStats(
            catService.countAvailableCats(),
            catService.countAdoptedCats(),
            catService.countPendingCats()
        );
        return ResponseEntity.ok(stats);
    }
    
    // Verificar si existe un gato
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkCatExists(@PathVariable String id) {
        boolean exists = catService.existsById(id);
        return ResponseEntity.ok(exists);
    }
    
    // Clase interna para estadísticas
    public static class CatStats {
        private long availableCats;
        private long adoptedCats;
        private long pendingCats;
        
        public CatStats(long availableCats, long adoptedCats, long pendingCats) {
            this.availableCats = availableCats;
            this.adoptedCats = adoptedCats;
            this.pendingCats = pendingCats;
        }
        
        // Getters
        public long getAvailableCats() { return availableCats; }
        public long getAdoptedCats() { return adoptedCats; }
        public long getPendingCats() { return pendingCats; }
        public long getTotalCats() { return availableCats + adoptedCats + pendingCats; }
    }
}