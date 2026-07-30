package com.profolio.backend.controller;

import com.profolio.backend.dto.request.AdminUserRequestDto;
import com.profolio.backend.dto.response.UserResponseDto;
import com.profolio.backend.entity.ERole;
import com.profolio.backend.entity.Role;
import com.profolio.backend.entity.User;
import com.profolio.backend.exception.ResourceNotFoundException;
import com.profolio.backend.exception.UserAlreadyExistsException;
import com.profolio.backend.repository.RoleRepository;
import com.profolio.backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "Todos") String role) {

        ERole roleEnum = null;
        if (role != null && !role.isEmpty() && !role.equalsIgnoreCase("Todos")) {
            try {
                roleEnum = ERole.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                if (role.equalsIgnoreCase("Usuario") || role.equalsIgnoreCase("ROLE_USER")) {
                    roleEnum = ERole.ROLE_USER;
                } else if (role.equalsIgnoreCase("Reclutador") || role.equalsIgnoreCase("ROLE_RECLUTADOR")) {
                    roleEnum = ERole.ROLE_RECLUTADOR;
                } else if (role.equalsIgnoreCase("Admin") || role.equalsIgnoreCase("ROLE_ADMIN")) {
                    roleEnum = ERole.ROLE_ADMIN;
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
                .fotoUrl(user.getFotoUrl())
                .telefono(user.getTelefono())
                .activo(user.getActivo() != null ? user.getActivo() : true)
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

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody AdminUserRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("El correo ya está registrado: " + request.getEmail());
        }

        Set<Role> roles = getRolesFromRequest(request.getRol());

        String passwordToHash = (request.getPassword() != null && !request.getPassword().isBlank())
                ? request.getPassword()
                : "Usuario123!";

        User user = User.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(passwordToHash))
                .activo(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        return new ResponseEntity<>(mapToDto(savedUser), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserRequestDto request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        user.setNombre(request.getNombre());
        user.setEmail(request.getEmail());

        if (request.getRol() != null && !request.getRol().isBlank()) {
            user.setRoles(getRolesFromRequest(request.getRol()));
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(mapToDto(updatedUser));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<UserResponseDto> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        user.setActivo(user.getActivo() == null || !user.getActivo());
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(mapToDto(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        userRepository.delete(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Usuario eliminado correctamente");
        return ResponseEntity.ok(response);
    }

    private Set<Role> getRolesFromRequest(String rolStr) {
        Set<Role> roles = new HashSet<>();
        ERole eRole = ERole.ROLE_USER;
        if (rolStr != null) {
            if (rolStr.equalsIgnoreCase("Admin") || rolStr.equalsIgnoreCase("ROLE_ADMIN")) {
                eRole = ERole.ROLE_ADMIN;
            } else if (rolStr.equalsIgnoreCase("Reclutador") || rolStr.equalsIgnoreCase("ROLE_RECLUTADOR")) {
                eRole = ERole.ROLE_RECLUTADOR;
            }
        }

        final ERole finalRole = eRole;
        Role targetRole = roleRepository.findByName(finalRole)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + finalRole));

        roles.add(targetRole);

        if (finalRole != ERole.ROLE_USER) {
            roleRepository.findByName(ERole.ROLE_USER).ifPresent(roles::add);
        }

        return roles;
    }

    private UserResponseDto mapToDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .nombre(user.getNombre())
                .name(user.getNombre())
                .email(user.getEmail())
                .fotoUrl(user.getFotoUrl())
                .telefono(user.getTelefono())
                .activo(user.getActivo() != null ? user.getActivo() : true)
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
                .build();
    }
}
