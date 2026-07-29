package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 50)
    private String tipo;

    @Column(nullable = false, length = 255)
    private String mensaje;

    @Column(name = "referencia_id")
    private Long referenciaId;

    @Column(nullable = false)
    @Builder.Default
    private Boolean leido = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fecha;

    @PrePersist
    protected void onCreate() {
        if (this.fecha == null) {
            this.fecha = LocalDateTime.now();
        }
        if (this.leido == null) {
            this.leido = false;
        }
    }
}
