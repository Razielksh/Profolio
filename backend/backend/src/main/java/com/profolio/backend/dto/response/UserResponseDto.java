package com.profolio.backend.dto.response;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String nombre;
    private String name;
    private String email;
    private String fotoUrl;
    private String telefono;
    private Boolean activo;
    private Set<String> roles;
}
