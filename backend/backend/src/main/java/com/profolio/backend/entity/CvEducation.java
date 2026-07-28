package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cv_education")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false)
    private Cv cv;

    @Column(nullable = false, length = 150)
    private String institucion;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(name = "anio_inicio")
    private Integer anioInicio;

    @Column(name = "anio_fin")
    private Integer anioFin;

    @Column(nullable = false)
    @Builder.Default
    private Integer orden = 0;
}
