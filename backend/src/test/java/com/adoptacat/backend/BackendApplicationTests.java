package com.adoptacat.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles; 

@SpringBootTest
@ActiveProfiles("test")  // <- usar perfil de pruebas
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
