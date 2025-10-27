package com.adoptacat.backend.controller;

import com.adoptacat.backend.service.ExcelReportService;
import com.adoptacat.backend.util.AdoptaCatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Controlador para la generación de reportes en Excel
 */
@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {
    
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
    
    @Autowired
    private ExcelReportService excelReportService;
    
    @Autowired
    private AdoptaCatUtils utils;
    
    /**
     * Genera y descarga reporte de gatos en Excel
     */
    @GetMapping("/cats")
    public ResponseEntity<byte[]> generateCatsReport() {
        try {
            logger.info("Solicitud de reporte de gatos recibida");
            
            byte[] reportData = excelReportService.generateCatsReport();
            
            String filename = "reporte_gatos_" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(reportData.length);
            
            utils.logAuditAction("DOWNLOAD_CATS_REPORT", "USER", 
                "Descarga de reporte de gatos: " + filename);
            
            return new ResponseEntity<>(reportData, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            logger.error("Error generando reporte de gatos", e);
            utils.logSecurityEvent("REPORT_GENERATION_ERROR", "SYSTEM", 
                "Error al generar reporte de gatos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Genera y descarga reporte de solicitudes de adopción en Excel
     */
    @GetMapping("/applications")
    public ResponseEntity<byte[]> generateApplicationsReport() {
        try {
            logger.info("Solicitud de reporte de solicitudes recibida");
            
            byte[] reportData = excelReportService.generateApplicationsReport();
            
            String filename = "reporte_solicitudes_" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(reportData.length);
            
            utils.logAuditAction("DOWNLOAD_APPLICATIONS_REPORT", "USER", 
                "Descarga de reporte de solicitudes: " + filename);
            
            return new ResponseEntity<>(reportData, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            logger.error("Error generando reporte de solicitudes", e);
            utils.logSecurityEvent("REPORT_GENERATION_ERROR", "SYSTEM", 
                "Error al generar reporte de solicitudes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Genera y descarga reporte completo en Excel
     */
    @GetMapping("/complete")
    public ResponseEntity<byte[]> generateCompleteReport() {
        try {
            logger.info("Solicitud de reporte completo recibida");
            
            byte[] reportData = excelReportService.generateCompleteReport();
            
            String filename = "reporte_completo_adoptacat_" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(reportData.length);
            
            utils.logAuditAction("DOWNLOAD_COMPLETE_REPORT", "USER", 
                "Descarga de reporte completo: " + filename);
            
            return new ResponseEntity<>(reportData, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            logger.error("Error generando reporte completo", e);
            utils.logSecurityEvent("REPORT_GENERATION_ERROR", "SYSTEM", 
                "Error al generar reporte completo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Endpoint para verificar disponibilidad del servicio de reportes
     */
    @GetMapping("/health")
    public ResponseEntity<ReportHealthStatus> getReportServiceHealth() {
        try {
            ReportHealthStatus status = new ReportHealthStatus(
                "UP", 
                "Servicio de reportes funcionando correctamente",
                LocalDateTime.now()
            );
            
            return ResponseEntity.ok(status);
            
        } catch (Exception e) {
            logger.error("Error verificando salud del servicio de reportes", e);
            
            ReportHealthStatus status = new ReportHealthStatus(
                "DOWN", 
                "Error en el servicio de reportes: " + e.getMessage(),
                LocalDateTime.now()
            );
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(status);
        }
    }
    
    /**
     * Clase para el estado de salud del servicio de reportes
     */
    public static class ReportHealthStatus {
        private String status;
        private String message;
        private LocalDateTime timestamp;
        
        public ReportHealthStatus(String status, String message, LocalDateTime timestamp) {
            this.status = status;
            this.message = message;
            this.timestamp = timestamp;
        }
        
        // Getters
        public String getStatus() { return status; }
        public String getMessage() { return message; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
}