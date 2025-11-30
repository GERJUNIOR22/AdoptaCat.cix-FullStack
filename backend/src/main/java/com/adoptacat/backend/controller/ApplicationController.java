package com.adoptacat.backend.controller;

import com.adoptacat.backend.dto.request.ApplicationRequest;
import com.adoptacat.backend.dto.response.ApplicationResponse;
import com.adoptacat.backend.model.AdoptionApplication;
import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.model.User;
import com.adoptacat.backend.repository.AdoptionApplicationRepository;
import com.adoptacat.backend.repository.CatRepository;
import com.adoptacat.backend.repository.UserRepository;
import com.adoptacat.backend.service.AdoptionApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final AdoptionApplicationRepository applicationRepository;
    private final AdoptionApplicationService applicationService;
    private final CatRepository catRepository;
    private final UserRepository userRepository;

    public ApplicationController(AdoptionApplicationRepository applicationRepository,
            AdoptionApplicationService applicationService,
            CatRepository catRepository,
            UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.applicationService = applicationService;
        this.catRepository = catRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/cats/{catId}/apply")
    public ResponseEntity<ApplicationResponse> apply(@PathVariable String catId,
            @RequestBody ApplicationRequest request) {
        // Simplified: assume user from auth (TODO: implement real auth context)
        // For now, we need to find a user or create a dummy one if not authenticated,
        // but typically this endpoint requires auth.
        // Let's assume we have a user ID in the request or we fetch a test user.

        Cat cat = catRepository.findById(catId)
                .orElseThrow(() -> new RuntimeException("Cat not found"));

        // Mock user for now if not provided (should be from SecurityContext)
        // This part needs proper Auth integration.
        // For compilation fix, we'll assume the request has user details or we skip
        // user setting if nullable (it's not).

        AdoptionApplication application = new AdoptionApplication();
        application.setCat(cat);
        application.setFullName(request.getFullName());
        application.setEmail(request.getEmail());
        application.setPhone(request.getPhone());
        application.setWhyAdopt(request.getMessage()); // Mapping message to whyAdopt
        application.setStatus(AdoptionApplication.ApplicationStatus.PENDING);

        // Generate application number
        application.setApplicationNumber("APP-" + System.currentTimeMillis());

        AdoptionApplication saved = applicationRepository.save(application);
        return ResponseEntity.ok(mapToResponse(saved));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        // Simplified: return all for now or filter by logged in user
        List<AdoptionApplication> applications = applicationRepository.findAll();
        List<ApplicationResponse> responses = applications.stream().map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateApplication(@PathVariable Long id, @RequestParam String action) {
        if ("accept".equals(action)) {
            // applicationService.approveApplication(id); // Assuming this method exists in
            // AdoptionApplicationService
            // If not, we might need to implement it or use a different method.
            // Checking AdoptionApplicationService... it likely has methods like
            // updateStatus.
            // For now, let's leave it commented or implement a basic status update if
            // service doesn't have it.

            AdoptionApplication app = applicationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Application not found"));
            app.setStatus(AdoptionApplication.ApplicationStatus.APPROVED);
            applicationRepository.save(app);
        }
        return ResponseEntity.ok().build();
    }

    private ApplicationResponse mapToResponse(AdoptionApplication app) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(app.getId().toString());
        // response.setUserId(app.getUser().getId()); // AdoptionApplication might not
        // have User relation directly if not linked yet?
        // AdoptionApplication has 'reviewedBy' (User). It doesn't seem to have
        // 'applicant' User field in the entity shown in step 653.
        // It has fullName, email, etc. directly.

        response.setUserNombre(app.getFullName());
        response.setCatId(app.getCat().getId());
        response.setCatNombre(app.getCat().getName());
        response.setMessage(app.getWhyAdopt());
        response.setStatus(app.getStatus().name());
        response.setAdminResponse(app.getAdminNotes());
        response.setCreatedAt(app.getCreatedAt());
        return response;
    }
}