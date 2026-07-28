package com.profolio.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDto {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private UserResponseDto user;
}
