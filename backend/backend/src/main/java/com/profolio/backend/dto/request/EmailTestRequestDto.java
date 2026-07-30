package com.profolio.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailTestRequestDto {

    @NotBlank(message = "El correo de destino es obligatorio")
    @Email(message = "El formato de correo no es válido")
    private String to;

    private String subject;

    private String message;

    private boolean isHtml;
}
