package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false, unique = true)
    private ERole name;

    // Alias de conveniencia para acceso con nombre 'nombre' conforme al diagrama
    public ERole getNombre() {
        return name;
    }

    public void setNombre(ERole nombre) {
        this.name = nombre;
    }
}
