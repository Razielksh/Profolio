package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false)
    private Cv cv;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    @Column(name = "canal_email", nullable = false)
    @Builder.Default
    private Boolean canalEmail = false;

    @Column(name = "canal_sms", nullable = false)
    @Builder.Default
    private Boolean canalSms = false;

    @Column(name = "canal_whatsapp", nullable = false)
    @Builder.Default
    private Boolean canalWhatsapp = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @Builder.Default
    private EEstadoMensaje estado = EEstadoMensaje.PENDIENTE;

    @Column(name = "fecha_envio", nullable = false, updatable = false)
    private LocalDateTime fechaEnvio;

    @PrePersist
    protected void onCreate() {
        if (this.fechaEnvio == null) {
            this.fechaEnvio = LocalDateTime.now();
        }
        if (this.estado == null) {
            this.estado = EEstadoMensaje.PENDIENTE;
        }
        if (this.canalEmail == null) this.canalEmail = false;
        if (this.canalSms == null) this.canalSms = false;
        if (this.canalWhatsapp == null) this.canalWhatsapp = false;
    }
}
