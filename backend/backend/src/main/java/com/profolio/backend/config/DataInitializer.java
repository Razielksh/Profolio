package com.profolio.backend.config;

import com.profolio.backend.entity.ERole;
import com.profolio.backend.entity.Role;
import com.profolio.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
            roleRepository.save(Role.builder().name(ERole.ROLE_USER).build());
        }

        if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(Role.builder().name(ERole.ROLE_ADMIN).build());
        }
    }
}
