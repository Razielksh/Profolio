package com.profolio.backend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationDto {
    private String titulo;
    private String colegio;
    private String fecha;
}
