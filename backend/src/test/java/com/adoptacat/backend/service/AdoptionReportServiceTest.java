package com.adoptacat.backend.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test TDD para AdoptionReportService
 * Verifica el uso correcto de las librerías implementadas
 */
@ExtendWith({SpringExtension.class, MockitoExtension.class})
class AdoptionReportServiceTest {

    private final AdoptionReportService adoptionReportService = new AdoptionReportService();

    @Test
    void generateAdoptionReport_ShouldCreateValidExcelFile() {
        // Arrange
        List<Map<String, Object>> testData = createTestData();

        // Act
        byte[] result = adoptionReportService.generateAdoptionReport(testData);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);

        // Verificar que es un archivo Excel válido
        try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(result))) {
            assertEquals(1, workbook.getNumberOfSheets());

            Sheet sheet = workbook.getSheet("Formularios de Adopción");
            assertNotNull(sheet);

            // Verificar encabezados
            Row headerRow = sheet.getRow(0);
            assertEquals("Nombre Completo", headerRow.getCell(0).getStringCellValue());
            assertEquals("Celular", headerRow.getCell(1).getStringCellValue());
            assertEquals("Correo Electrónico", headerRow.getCell(2).getStringCellValue());

            // Verificar datos
            Row dataRow = sheet.getRow(1);
            assertEquals("Test User", dataRow.getCell(0).getStringCellValue());
            assertEquals("123456789", dataRow.getCell(1).getStringCellValue());
        } catch (Exception e) {
            fail("El archivo generado no es un Excel válido: " + e.getMessage());
        }
    }

    @Test
    void generateAdoptionReport_WithEmptyData_ShouldCreateValidExcel() {
        // Arrange
        List<Map<String, Object>> emptyData = Arrays.asList();

        // Act
        byte[] result = adoptionReportService.generateAdoptionReport(emptyData);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);

        try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(result))) {
            Sheet sheet = workbook.getSheet("Formularios de Adopción");
            assertNotNull(sheet);

            // Solo fila de encabezados
            assertEquals(1, sheet.getLastRowNum() + 1);
        } catch (Exception e) {
            fail("Error con datos vacíos: " + e.getMessage());
        }
    }

    @Test
    void generateAdoptionReport_ShouldHandleNullValues() {
        // Arrange
        Map<String, Object> dataWithNulls = new HashMap<>();
        dataWithNulls.put("nombreCompleto", null);
        dataWithNulls.put("celular", "123456789");
        dataWithNulls.put("correoElectronico", null);
        dataWithNulls.put("estadoCivil", "soltero");
        dataWithNulls.put("direccion", null);
        dataWithNulls.put("porqueAdoptar", "Quiero adoptar");
        dataWithNulls.put("tieneMascotasActuales", null);
        dataWithNulls.put("aceptoCondiciones", true);

        List<Map<String, Object>> testData = Arrays.asList(dataWithNulls);

        // Act
        byte[] result = adoptionReportService.generateAdoptionReport(testData);

        // Assert
        assertNotNull(result);

        try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(result))) {
            Sheet sheet = workbook.getSheet("Formularios de Adopción");
            Row dataRow = sheet.getRow(1);

            // Verificar que valores null se convierten a string vacío
            assertEquals("", dataRow.getCell(0).getStringCellValue());
            assertEquals("123456789", dataRow.getCell(1).getStringCellValue());
            assertEquals("", dataRow.getCell(2).getStringCellValue());
        } catch (Exception e) {
            fail("Error manejando valores null: " + e.getMessage());
        }
    }

    private List<Map<String, Object>> createTestData() {
        Map<String, Object> form = new HashMap<>();
        form.put("nombreCompleto", "Test User");
        form.put("celular", "123456789");
        form.put("correoElectronico", "test@example.com");
        form.put("estadoCivil", "soltero");
        form.put("direccion", "Test Address");
        form.put("porqueAdoptar", "I love cats");
        form.put("tieneMascotasActuales", true);
        form.put("aceptoCondiciones", true);

        return Arrays.asList(form);
    }
}