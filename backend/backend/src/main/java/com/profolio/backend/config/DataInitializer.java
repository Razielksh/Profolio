package com.profolio.backend.config;

import com.profolio.backend.entity.ERole;
import com.profolio.backend.entity.Role;
import com.profolio.backend.entity.User;
import com.profolio.backend.repository.RoleRepository;
import com.profolio.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Inicializar Roles si no existen
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(ERole.ROLE_USER).build()));

        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(ERole.ROLE_ADMIN).build()));

        Role reclutadorRole = roleRepository.findByName(ERole.ROLE_RECLUTADOR)
                .orElseGet(() -> roleRepository.save(Role.builder().name(ERole.ROLE_RECLUTADOR).build()));

        // 2. Crear Administrador por defecto si no existe
        if (!userRepository.existsByEmail("admin@profolio.com")) {
            User adminUser = User.builder()
                    .name("Administrador General")
                    .email("admin@profolio.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .roles(Set.of(adminRole, userRole))
                    .build();
            userRepository.save(adminUser);
            System.out.println("✅ Usuario Admin creado automáticamente: admin@profolio.com / Admin123!");
        }

        // 3. Crear Reclutador por defecto si no existe
        if (!userRepository.existsByEmail("reclutador@profolio.com")) {
            User reclutadorUser = User.builder()
                    .name("Carlos Reclutador")
                    .email("reclutador@profolio.com")
                    .password(passwordEncoder.encode("Reclutador123!"))
                    .roles(Set.of(reclutadorRole, userRole))
                    .build();
            userRepository.save(reclutadorUser);
            System.out.println("✅ Usuario Reclutador creado automáticamente: reclutador@profolio.com / Reclutador123!");
        }
    }
}
