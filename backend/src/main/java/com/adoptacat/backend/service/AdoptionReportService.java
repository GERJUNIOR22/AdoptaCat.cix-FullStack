
package com.adoptacat.backend.service;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Servicio para generar reportes de adopción usando librerías avanzadas
 * Implementa el uso de Google Guava, Apache POI, Apache Commons y Logback
 */
@Service
public class AdoptionReportService {

    private static final Logger logger = LoggerFactory.getLogger(AdoptionReportService.class);

    /**
     * Genera un reporte Excel con formularios de adopción
     * Usa Apache POI para manipulación de Excel
     * Usa Google Guava para colecciones inmutables
     * Usa Apache Commons para validaciones
     * Usa Logback para logging
     */
    public byte[] generateAdoptionReport(List<Map<String, Object>> adoptionForms) {
        logger.info("Iniciando generación de reporte de adopción con {} formularios", adoptionForms.size());

        // Usar List.of() para crear lista inmutable
        List<Map<String, Object>> immutableForms = List.copyOf(adoptionForms);
        logger.debug("Lista de formularios convertida a inmutable");

        try (Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Formularios de Adopción");

            // Crear estilos con Apache POI
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            // Encabezados usando Apache Commons para capitalizar
            List<String> headers = List.of(
                    StringUtils.capitalize("Nombre Completo"),
                    StringUtils.capitalize("Celular"),
                    StringUtils.capitalize("Correo Electrónico"),
                    StringUtils.capitalize("Estado Civil"),
                    StringUtils.capitalize("Dirección"),
                    StringUtils.capitalize("¿Por qué adoptar?"),
                    StringUtils.capitalize("¿Tiene mascotas actuales?"),
                    StringUtils.capitalize("¿Acepta condiciones?"));

            // Crear fila de encabezados
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers.get(i));
                cell.setCellStyle(headerStyle);
                sheet.autoSizeColumn(i);
            }

            // Llenar datos
            int rowNum = 1;
            for (Map<String, Object> form : immutableForms) {
                Row row = sheet.createRow(rowNum++);

                // Usar Apache Commons para validaciones
                String nombreCompleto = StringUtils.defaultString((String) form.get("nombreCompleto"));
                String celular = StringUtils.defaultString((String) form.get("celular"));
                String correo = StringUtils.defaultString((String) form.get("correoElectronico"));
                String estadoCivil = StringUtils.defaultString((String) form.get("estadoCivil"));
                String direccion = StringUtils.defaultString((String) form.get("direccion"));
                String porqueAdoptar = StringUtils.defaultString((String) form.get("porqueAdoptar"));
                Boolean tieneMascotas = (Boolean) form.get("tieneMascotasActuales");
                Boolean aceptaCondiciones = (Boolean) form.get("aceptoCondiciones");

                row.createCell(0).setCellValue(nombreCompleto);
                row.createCell(1).setCellValue(celular);
                row.createCell(2).setCellValue(correo);
                row.createCell(3).setCellValue(estadoCivil);
                row.createCell(4).setCellValue(direccion);
                row.createCell(5).setCellValue(porqueAdoptar);

                // Extraer operaciones ternarias anidadas
                String tieneMascotasText = convertBooleanToText(tieneMascotas);
                String aceptaCondicionesText = convertBooleanToText(aceptaCondiciones);

                row.createCell(6).setCellValue(tieneMascotasText);
                row.createCell(7).setCellValue(aceptaCondicionesText);

                // Aplicar estilo a las celdas de datos
                for (int i = 0; i < 8; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }

            // Autoajustar columnas
            for (int i = 0; i < headers.size(); i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);
            logger.info("Reporte de adopción generado exitosamente con {} filas", rowNum - 1);

            return outputStream.toByteArray();

        } catch (IOException e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al generar reporte Excel de adopción con {} formularios: {}",
                    adoptionForms.size(), e.getMessage(), e);
            throw new ReportGenerationException("Error generando reporte de adopción", e);
        }
    }

    /**
     * Convierte un valor Boolean a texto legible
     */
    private String convertBooleanToText(Boolean value) {
        if (value == null) {
            return "N/A";
        }
        return value ? "Sí" : "No";
    }

    /**
     * Crea estilo para encabezados usando Apache POI
     */
    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    /**
     * Crea estilo para datos usando Apache POI
     */
    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    /**
     * Excepción personalizada para errores en la generación de reportes
     */
    public static class ReportGenerationException extends RuntimeException {
        public ReportGenerationException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}