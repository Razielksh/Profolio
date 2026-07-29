package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 50)
    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "preview_url", length = 255)
    private String previewUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @PrePersist
    protected void onCreate() {
        if (this.activo == null) {
            this.activo = true;
        }
    }
}
