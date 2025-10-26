package com.adoptacat.backend.service;

import com.adoptacat.backend.model.AdoptionApplication;
import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.repository.AdoptionApplicationRepository;
import com.adoptacat.backend.repository.CatRepository;
import com.adoptacat.backend.util.AdoptaCatUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Servicio para generar reportes en Excel usando Apache POI
 */
@Service
public class ExcelReportService {
    
    private static final Logger logger = LoggerFactory.getLogger(ExcelReportService.class);
    
    @Autowired
    private CatRepository catRepository;
    
    @Autowired
    private AdoptionApplicationRepository applicationRepository;
    
    @Autowired
    private AdoptaCatUtils utils;
    
    /**
     * Genera un reporte completo de gatos en formato Excel
     */
    public byte[] generateCatsReport() throws IOException {
        logger.info("Iniciando generación de reporte de gatos");
        
        try (Workbook workbook = new XSSFWorkbook()) {
            // Crear hoja de gatos
            Sheet catsSheet = workbook.createSheet("Gatos");
            
            // Configurar estilos
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            
            // Crear encabezados
            createCatsHeader(catsSheet, headerStyle);
            
            // Obtener datos
            List<Cat> cats = catRepository.findAll();
            
            // Llenar datos
            fillCatsData(catsSheet, cats, dataStyle, dateStyle);
            
            // Ajustar ancho de columnas
            autoSizeColumns(catsSheet, 12);
            
            // Crear hoja de estadísticas
            createStatsSheet(workbook, cats);
            
            // Convertir a bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            
            utils.logAuditAction("GENERATE_CATS_REPORT", "SYSTEM", 
                "Reporte de gatos generado con " + cats.size() + " registros");
            
            logger.info("Reporte de gatos generado exitosamente con {} registros", cats.size());
            
            return outputStream.toByteArray();
        }
    }
    
    /**
     * Genera un reporte de solicitudes de adopción en formato Excel
     */
    public byte[] generateApplicationsReport() throws IOException {
        logger.info("Iniciando generación de reporte de solicitudes");
        
        try (Workbook workbook = new XSSFWorkbook()) {
            // Crear hoja de solicitudes
            Sheet applicationsSheet = workbook.createSheet("Solicitudes de Adopción");
            
            // Configurar estilos
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            
            // Crear encabezados
            createApplicationsHeader(applicationsSheet, headerStyle);
            
            // Obtener datos
            List<AdoptionApplication> applications = applicationRepository.findAll();
            
            // Llenar datos
            fillApplicationsData(applicationsSheet, applications, dataStyle, dateStyle);
            
            // Ajustar ancho de columnas
            autoSizeColumns(applicationsSheet, 15);
            
            // Crear hojas adicionales por estado
            createApplicationsByStatusSheets(workbook, applications);
            
            // Convertir a bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            
            utils.logAuditAction("GENERATE_APPLICATIONS_REPORT", "SYSTEM", 
                "Reporte de solicitudes generado con " + applications.size() + " registros");
            
            logger.info("Reporte de solicitudes generado exitosamente con {} registros", 
                applications.size());
            
            return outputStream.toByteArray();
        }
    }
    
    /**
     * Genera un reporte combinado con múltiples hojas
     */
    public byte[] generateCompleteReport() throws IOException {
        logger.info("Iniciando generación de reporte completo");
        
        try (Workbook workbook = new XSSFWorkbook()) {
            // Configurar estilos
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            
            // Hoja 1: Resumen ejecutivo
            createExecutiveSummarySheet(workbook);
            
            // Hoja 2: Gatos
            Sheet catsSheet = workbook.createSheet("Gatos");
            createCatsHeader(catsSheet, headerStyle);
            List<Cat> cats = catRepository.findAll();
            fillCatsData(catsSheet, cats, dataStyle, dateStyle);
            autoSizeColumns(catsSheet, 12);
            
            // Hoja 3: Solicitudes
            Sheet applicationsSheet = workbook.createSheet("Solicitudes");
            createApplicationsHeader(applicationsSheet, headerStyle);
            List<AdoptionApplication> applications = applicationRepository.findAll();
            fillApplicationsData(applicationsSheet, applications, dataStyle, dateStyle);
            autoSizeColumns(applicationsSheet, 15);
            
            // Hoja 4: Estadísticas
            createDetailedStatsSheet(workbook, cats, applications);
            
            // Convertir a bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            
            utils.logAuditAction("GENERATE_COMPLETE_REPORT", "SYSTEM", 
                "Reporte completo generado");
            
            logger.info("Reporte completo generado exitosamente");
            
            return outputStream.toByteArray();
        }
    }
    
    // Métodos privados para crear estilos
    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }
    
    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }
    
    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = createDataStyle(workbook);
        CreationHelper creationHelper = workbook.getCreationHelper();
        style.setDataFormat(creationHelper.createDataFormat().getFormat("dd/mm/yyyy"));
        return style;
    }
    
    // Métodos privados para crear encabezados
    private void createCatsHeader(Sheet sheet, CellStyle headerStyle) {
        Row headerRow = sheet.createRow(0);
        String[] headers = {
            "ID", "Nombre", "Edad", "Raza", "Género", "Tamaño", 
            "Vacunado", "Esterilizado", "Necesidades Especiales", 
            "Estado de Adopción", "Destacado", "Fecha de Llegada"
        };
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
    }
    
    private void createApplicationsHeader(Sheet sheet, CellStyle headerStyle) {
        Row headerRow = sheet.createRow(0);
        String[] headers = {
            "ID", "Número", "Gato", "Solicitante", "Email", "Teléfono", 
            "Ciudad", "Experiencia Previa", "Recursos Veterinarios", 
            "Acepta Visitas", "Estado", "Fecha Solicitud", "Fecha Revisión"
        };
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
    }
    
    // Métodos privados para llenar datos
    private void fillCatsData(Sheet sheet, List<Cat> cats, CellStyle dataStyle, CellStyle dateStyle) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        
        for (int i = 0; i < cats.size(); i++) {
            Row row = sheet.createRow(i + 1);
            Cat cat = cats.get(i);
            
            createCell(row, 0, cat.getId(), dataStyle);
            createCell(row, 1, cat.getName(), dataStyle);
            createCell(row, 2, cat.getAge(), dataStyle);
            createCell(row, 3, cat.getBreed(), dataStyle);
            createCell(row, 4, cat.getGender() != null ? cat.getGender().name() : "", dataStyle);
            createCell(row, 5, cat.getSize() != null ? cat.getSize().name() : "", dataStyle);
            createCell(row, 6, cat.getIsVaccinated() ? "Sí" : "No", dataStyle);
            createCell(row, 7, cat.getIsSterilized() ? "Sí" : "No", dataStyle);
            createCell(row, 8, cat.getIsSpecialNeeds() ? "Sí" : "No", dataStyle);
            createCell(row, 9, cat.getAdoptionStatus() != null ? cat.getAdoptionStatus().name() : "", dataStyle);
            createCell(row, 10, cat.getFeatured() ? "Sí" : "No", dataStyle);
            
            if (cat.getArrivedAt() != null) {
                createCell(row, 11, cat.getArrivedAt().format(dateFormatter), dateStyle);
            } else {
                createCell(row, 11, "", dataStyle);
            }
        }
    }
    
    private void fillApplicationsData(Sheet sheet, List<AdoptionApplication> applications, 
                                    CellStyle dataStyle, CellStyle dateStyle) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        
        for (int i = 0; i < applications.size(); i++) {
            Row row = sheet.createRow(i + 1);
            AdoptionApplication app = applications.get(i);
            
            createCell(row, 0, app.getId().toString(), dataStyle);
            createCell(row, 1, app.getApplicationNumber(), dataStyle);
            createCell(row, 2, app.getCat() != null ? app.getCat().getName() : "", dataStyle);
            createCell(row, 3, app.getFullName(), dataStyle);
            createCell(row, 4, app.getEmail(), dataStyle);
            createCell(row, 5, app.getPhone(), dataStyle);
            createCell(row, 6, app.getCity(), dataStyle);
            createCell(row, 7, app.getHadPreviousPets() ? "Sí" : "No", dataStyle);
            createCell(row, 8, app.getHasVetResources() ? "Sí" : "No", dataStyle);
            createCell(row, 9, app.getAcceptsVisits() ? "Sí" : "No", dataStyle);
            createCell(row, 10, app.getStatus() != null ? app.getStatus().name() : "", dataStyle);
            
            if (app.getCreatedAt() != null) {
                createCell(row, 11, app.getCreatedAt().format(dateTimeFormatter), dateStyle);
            } else {
                createCell(row, 11, "", dataStyle);
            }
            
            if (app.getReviewDate() != null) {
                createCell(row, 12, app.getReviewDate().format(dateTimeFormatter), dateStyle);
            } else {
                createCell(row, 12, "", dataStyle);
            }
        }
    }
    
    private void createCell(Row row, int column, String value, CellStyle style) {
        Cell cell = row.createCell(column);
        cell.setCellValue(value != null ? value : "");
        cell.setCellStyle(style);
    }
    
    private void autoSizeColumns(Sheet sheet, int numColumns) {
        for (int i = 0; i < numColumns; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void createStatsSheet(Workbook workbook, List<Cat> cats) {
        Sheet statsSheet = workbook.createSheet("Estadísticas");
        
        // Contar por estado
        long available = cats.stream().filter(c -> c.getAdoptionStatus() == Cat.AdoptionStatus.AVAILABLE).count();
        long adopted = cats.stream().filter(c -> c.getAdoptionStatus() == Cat.AdoptionStatus.ADOPTED).count();
        long pending = cats.stream().filter(c -> c.getAdoptionStatus() == Cat.AdoptionStatus.PENDING).count();
        
        // Crear filas de estadísticas
        Row row1 = statsSheet.createRow(0);
        row1.createCell(0).setCellValue("Estadística");
        row1.createCell(1).setCellValue("Cantidad");
        
        Row row2 = statsSheet.createRow(1);
        row2.createCell(0).setCellValue("Gatos Disponibles");
        row2.createCell(1).setCellValue(available);
        
        Row row3 = statsSheet.createRow(2);
        row3.createCell(0).setCellValue("Gatos Adoptados");
        row3.createCell(1).setCellValue(adopted);
        
        Row row4 = statsSheet.createRow(3);
        row4.createCell(0).setCellValue("Gatos Pendientes");
        row4.createCell(1).setCellValue(pending);
    }
    
    private void createApplicationsByStatusSheets(Workbook workbook, List<AdoptionApplication> applications) {
        // Agrupar por estado y crear hojas
        for (AdoptionApplication.ApplicationStatus status : AdoptionApplication.ApplicationStatus.values()) {
            List<AdoptionApplication> filtered = applications.stream()
                .filter(app -> app.getStatus() == status)
                .toList();
            
            if (!filtered.isEmpty()) {
                Sheet sheet = workbook.createSheet("Solicitudes " + status.name());
                createApplicationsHeader(sheet, createHeaderStyle(workbook));
                fillApplicationsData(sheet, filtered, createDataStyle(workbook), createDateStyle(workbook));
                autoSizeColumns(sheet, 13);
            }
        }
    }
    
    private void createExecutiveSummarySheet(Workbook workbook) {
        Sheet summarySheet = workbook.createSheet("Resumen Ejecutivo");
        
        Row titleRow = summarySheet.createRow(0);
        titleRow.createCell(0).setCellValue("REPORTE ADOPTACAT - RESUMEN EJECUTIVO");
        
        summarySheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));
        
        // Aquí se pueden agregar más estadísticas resumidas
        Row dateRow = summarySheet.createRow(2);
        dateRow.createCell(0).setCellValue("Fecha de generación:");
        dateRow.createCell(1).setCellValue(java.time.LocalDateTime.now().format(
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
    }
    
    private void createDetailedStatsSheet(Workbook workbook, List<Cat> cats, 
                                        List<AdoptionApplication> applications) {
        Sheet statsSheet = workbook.createSheet("Estadísticas Detalladas");
        
        int rowNum = 0;
        
        // Título
        Row titleRow = statsSheet.createRow(rowNum++);
        titleRow.createCell(0).setCellValue("ESTADÍSTICAS DETALLADAS");
        
        rowNum++; // Fila vacía
        
        // Estadísticas de gatos
        Row catsHeaderRow = statsSheet.createRow(rowNum++);
        catsHeaderRow.createCell(0).setCellValue("GATOS");
        
        Row totalCatsRow = statsSheet.createRow(rowNum++);
        totalCatsRow.createCell(0).setCellValue("Total de gatos:");
        totalCatsRow.createCell(1).setCellValue(cats.size());
        
        // Más estadísticas...
        // Se pueden agregar gráficos y análisis más detallados
    }
}