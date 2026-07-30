package com.profolio.backend.controller;

import com.profolio.backend.dto.response.UserResponseDto;
import com.profolio.backend.entity.User;
import com.profolio.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "Todos") String role) {

        com.profolio.backend.entity.ERole roleEnum = null;
        if (role != null && !role.isEmpty() && !role.equalsIgnoreCase("Todos")) {
            try {
                roleEnum = com.profolio.backend.entity.ERole.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Si pasan un rol no soportado como "Usuario" o "Reclutador" (sin prefijo ROLE_)
                if (role.equalsIgnoreCase("Usuario") || role.equalsIgnoreCase("ROLE_USER")) {
                    roleEnum = com.profolio.backend.entity.ERole.ROLE_USER;
                } else if (role.equalsIgnoreCase("Reclutador") || role.equalsIgnoreCase("ROLE_RECLUTADOR")) {
                    roleEnum = com.profolio.backend.entity.ERole.ROLE_RECLUTADOR;
                } else if (role.equalsIgnoreCase("Admin") || role.equalsIgnoreCase("ROLE_ADMIN")) {
                    roleEnum = com.profolio.backend.entity.ERole.ROLE_ADMIN;
                }
            }
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<User> userPage = userRepository.searchUsersPaginated(search, roleEnum, pageable);

        var content = userPage.getContent().stream().map(user -> UserResponseDto.builder()
                .id(user.getId())
                .nombre(user.getNombre())
                .name(user.getNombre())
                .email(user.getEmail())
                .activo(true)
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
                .build()
        ).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("users", content);
        response.put("currentPage", userPage.getNumber());
        response.put("totalItems", userPage.getTotalElements());
        response.put("totalPages", userPage.getTotalPages());

        return ResponseEntity.ok(response);
    }
}
