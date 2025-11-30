package com.adoptacat.backend.controller;

import com.adoptacat.backend.service.ExcelReportService;
import com.adoptacat.backend.service.AdoptionReportService;
import com.adoptacat.backend.util.AdoptaCatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador para la generación de reportes en Excel
 */
@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {
    
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
    
    // Constantes para evitar duplicación de strings literales
    private static final String XLSX_EXTENSION = ".xlsx";
    private static final String DATE_TIME_PATTERN = "yyyyMMdd_HHmmss";
    private static final String ATTACHMENT_DISPOSITION = "attachment";
    private static final String REPORT_GENERATION_ERROR = "REPORT_GENERATION_ERROR";
    private static final String SYSTEM_USER = "SYSTEM";
    
    private final ExcelReportService excelReportService;
    private final AdoptionReportService adoptionReportService;
    private final AdoptaCatUtils utils;
    
    // Constructor injection
    public ReportController(ExcelReportService excelReportService, 
                          AdoptionReportService adoptionReportService,
                          AdoptaCatUtils utils) {
        this.excelReportService = excelReportService;
        this.adoptionReportService = adoptionReportService;
        this.utils = utils;
    }
    
    /**
     * Genera y descarga reporte de gatos en Excel
     */
    @GetMapping("/cats")
    public ResponseEntity<byte[]> generateCatsReport() {
        try {
            logger.info("Solicitud de reporte de gatos recibida");
            
            byte[] reportData = excelReportService.generateCatsReport();
            
            String filename = "reporte_gatos_" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATE_TIME_PATTERN)) + XLSX_EXTENSION;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData(ATTACHMENT_DISPOSITION, filename);
            headers.setContentLength(reportData.length);
            
            utils.logAuditAction("DOWNLOAD_CATS_REPORT", "USER", 
                "Descarga de reporte de gatos: " + filename);
            
            return new ResponseEntity<>(reportData, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            logger.error("Error generando reporte de gatos", e);
            utils.logSecurityEvent(REPORT_GENERATION_ERROR, SYSTEM_USER, 
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
                LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATE_TIME_PATTERN)) + XLSX_EXTENSION;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData(ATTACHMENT_DISPOSITION, filename);
            headers.setContentLength(reportData.length);
            
            utils.logAuditAction("DOWNLOAD_APPLICATIONS_REPORT", "USER", 
                "Descarga de reporte de solicitudes: " + filename);
            
            return new ResponseEntity<>(reportData, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            logger.error("Error generando reporte de solicitudes", e);
            utils.logSecurityEvent(REPORT_GENERATION_ERROR, SYSTEM_USER, 
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
                LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATE_TIME_PATTERN)) + XLSX_EXTENSION;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData(ATTACHMENT_DISPOSITION, filename);
            headers.setContentLength(reportData.length);
            
            utils.logAuditAction("DOWNLOAD_COMPLETE_REPORT", "USER", 
                "Descarga de reporte completo: " + filename);
            
            return new ResponseEntity<>(reportData, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            logger.error("Error generando reporte completo", e);
            utils.logSecurityEvent(REPORT_GENERATION_ERROR, SYSTEM_USER, 
                "Error al generar reporte completo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Genera y descarga reporte de formularios de adopción usando librerías avanzadas
     * Implementa Google Guava, Apache POI, Apache Commons y Logback
     */
    @GetMapping("/adoption-forms")
    public ResponseEntity<byte[]> generateAdoptionFormsReport() {
        try {
            logger.info("Solicitud de reporte de formularios de adopción usando librerías avanzadas");

            // Datos de ejemplo (en producción se obtendrían de la base de datos)
            List<Map<String, Object>> sampleData = createSampleAdoptionData();

            byte[] reportData = adoptionReportService.generateAdoptionReport(sampleData);

            String filename = "formularios_adopcion_" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATE_TIME_PATTERN)) + XLSX_EXTENSION;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData(ATTACHMENT_DISPOSITION, filename);
            headers.setContentLength(reportData.length);

            utils.logAuditAction("DOWNLOAD_ADOPTION_FORMS_REPORT", "USER",
                "Descarga de reporte de formularios de adopción: " + filename);

            return new ResponseEntity<>(reportData, headers, HttpStatus.OK);

        } catch (Exception e) {
            logger.error("Error generando reporte de formularios de adopción", e);
            utils.logSecurityEvent("ADOPTION_REPORT_GENERATION_ERROR", SYSTEM_USER,
                "Error al generar reporte de formularios: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Crea datos de ejemplo para formularios de adopción
     */
    private List<Map<String, Object>> createSampleAdoptionData() {
        Map<String, Object> form1 = new HashMap<>();
        form1.put("nombreCompleto", "Fiorella Huancas Jara");
        form1.put("celular", "912624724");
        form1.put("correoElectronico", "fiorellahuancasjara8@gmail.com");
        form1.put("estadoCivil", "soltera");
        form1.put("direccion", "José Leonardo Ortiz 240 a Pimentel");
        form1.put("porqueAdoptar", "Tengo una gatita llamada mica pero me mudé y se quedó con mi mamá. Quiero una pero al ver la publicación de que son dos me daría pena separarlas.");
        form1.put("tieneMascotasActuales", false);
        form1.put("aceptoCondiciones", true);

        Map<String, Object> form2 = new HashMap<>();
        form2.put("nombreCompleto", "Juan Pérez");
        form2.put("celular", "987654321");
        form2.put("correoElectronico", "juan@example.com");
        form2.put("estadoCivil", "casado");
        form2.put("direccion", "Av. Principal 123");
        form2.put("porqueAdoptar", "Me encantan los gatos y quiero darles un hogar amoroso.");
        form2.put("tieneMascotasActuales", true);
        form2.put("aceptoCondiciones", true);

        return Arrays.asList(form1, form2);
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