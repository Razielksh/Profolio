package com.profolio.backend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalInfoDto {
    private String nombre;
    private String apellido;
    private String titulo;
    private String email;
    private String telefono;
    private String ubicacion;
    private String linkedin;
    private String resumen;
}
