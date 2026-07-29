package com.profolio.backend.dto.request;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvExportRequestDto {
    private PersonalInfoDto personal;
    private List<ExperienceDto> experiencias;
    private List<EducationDto> educacion;
    private List<String> habilidades;
    private StyleSettingsDto estilos;
}
