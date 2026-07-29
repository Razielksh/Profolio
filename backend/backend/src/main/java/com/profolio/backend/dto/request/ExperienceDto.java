package com.profolio.backend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperienceDto {
    private String puesto;
    private String empresa;
    private String ubicacion;
    private String fecha;
    private String descripcion;
}
