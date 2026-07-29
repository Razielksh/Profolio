package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "foto_url", nullable = true, length = 255)
    private String fotoUrl;

    @Column(name = "telefono", nullable = true, length = 20)
    private String telefono;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        if (this.activo == null) {
            this.activo = true;
        }
    }

    // Métodos de conveniencia para compatibilidad con código existente
    public String getName() {
        return nombre;
    }

    public void setName(String name) {
        this.nombre = name;
    }

    public static class UserBuilder {
        public UserBuilder name(String name) {
            this.nombre = name;
            return this;
        }
    }
}
