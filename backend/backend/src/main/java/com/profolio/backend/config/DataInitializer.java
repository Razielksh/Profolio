package com.profolio.backend.config;

import com.profolio.backend.entity.ERole;
import com.profolio.backend.entity.Role;
import com.profolio.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * DataInitializer — Validación de datos semilla.
 *
 * Los datos reales (roles, usuarios, CVs, etc.) son insertados
 * por Flyway en V2__datos_semilla.sql.
 *
 * Este componente solo verifica que los roles existan como
 * salvaguarda en caso de que Flyway no haya podido insertar los datos.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        // Flyway ya inserta los roles. Solo verificamos como fallback.
        for (ERole roleName : ERole.values()) {
            roleRepository.findByName(roleName).orElseGet(() -> {
                System.out.printf("⚠️  Rol %s no encontrado, insertando...%n", roleName);
                return roleRepository.save(Role.builder().name(roleName).build());
            });
        }
        System.out.println("✅ Roles verificados correctamente.");
    }
}
