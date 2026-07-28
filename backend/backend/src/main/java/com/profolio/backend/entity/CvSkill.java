package com.profolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cv_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false)
    private Cv cv;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 50)
    private String nivel;

    @Column(nullable = false)
    @Builder.Default
    private Integer orden = 0;
}
