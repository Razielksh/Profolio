package com.profolio.backend.dto.request;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvSaveRequestDto {
    private Long   id;           // null = nuevo CV, número = actualizar existente
    private String titulo;
    private String privacidad;   // "PUBLICO" | "PRIVADO"
    private String colorPrimario;

    // Datos personales (se mapean a campos de Cv)
    private String nombreContacto;
    private String tituloProfesional;
    private String linkedinUrl;
    private String resumen;

    private List<ExperienciaDto> experiencias;
    private List<EducacionDto>   educacion;
    private List<HabilidadDto>   habilidades;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ExperienciaDto {
        private Long   id;         // null = nueva
        private String puesto;     // → cargo
        private String empresa;
        private String fecha;      // texto libre ej. "2022 - Presente"
        private String descripcion;
        private Integer orden;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EducacionDto {
        private Long    id;         // null = nueva
        private String  titulo;
        private String  colegio;    // → institucion
        private String  fecha;      // ej. "2019" → anioFin
        private Integer orden;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class HabilidadDto {
        private Long   id;          // null = nueva
        private String nombre;
        private String nivel;
        private Integer orden;
    }
}
