package com.profolio.backend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StyleSettingsDto {
    private String color;
    private String font;
}
