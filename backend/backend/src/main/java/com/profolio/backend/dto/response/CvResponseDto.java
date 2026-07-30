package com.profolio.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvResponseDto {
    private Long   id;
    private String titulo;
    private String privacidad;
    private String colorPrimario;
    private Long   templateId;
    private Integer vistas;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;

    // datos personales
    private String nombreContacto;
    private String tituloProfesional;
    private String linkedinUrl;
    private String resumen;

    private List<ExperienciaDto> experiencias;
    private List<EducacionDto>   educacion;
    private List<HabilidadDto>   habilidades;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ExperienciaDto {
        private Long   id;
        private String puesto;
        private String empresa;
        private String fecha;
        private String descripcion;
        private Integer orden;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EducacionDto {
        private Long    id;
        private String  titulo;
        private String  colegio;
        private String  fecha;
        private Integer orden;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class HabilidadDto {
        private Long    id;
        private String  nombre;
        private String  nivel;
        private Integer orden;
    }
}
