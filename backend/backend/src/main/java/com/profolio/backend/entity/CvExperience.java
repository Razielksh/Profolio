package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "cv_experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false)
    private Cv cv;

    @Column(nullable = false, length = 150)
    private String empresa;

    @Column(nullable = false, length = 150)
    private String cargo;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    @Builder.Default
    private Integer orden = 0;
}
