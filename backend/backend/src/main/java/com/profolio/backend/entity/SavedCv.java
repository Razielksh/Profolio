package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_cvs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedCv {

    @EmbeddedId
    private SavedCvKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("recruiterId")
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("cvId")
    @JoinColumn(name = "cv_id", nullable = false)
    private Cv cv;

    @Column(name = "fecha_guardado", nullable = false, updatable = false)
    private LocalDateTime fechaGuardado;

    @PrePersist
    protected void onCreate() {
        if (this.fechaGuardado == null) {
            this.fechaGuardado = LocalDateTime.now();
        }
    }
}
