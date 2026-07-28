package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cvs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cv {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "template_id")
    private Long templateId;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(name = "nombre_contacto", length = 100)
    private String nombreContacto;

    @Column(name = "titulo_profesional", length = 150)
    private String tituloProfesional;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(columnDefinition = "TEXT")
    private String resumen;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @Builder.Default
    private EPrivacidad privacidad = EPrivacidad.PUBLICO;

    @Column(nullable = false)
    @Builder.Default
    private Integer vistas = 0;

    @Column(name = "color_primario", length = 30)
    private String colorPrimario;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (this.fechaCreacion == null) {
            this.fechaCreacion = now;
        }
        this.fechaModificacion = now;
        if (this.vistas == null) {
            this.vistas = 0;
        }
        if (this.privacidad == null) {
            this.privacidad = EPrivacidad.PUBLICO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaModificacion = LocalDateTime.now();
    }
}
