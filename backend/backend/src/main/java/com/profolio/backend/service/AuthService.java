package com.profolio.backend.service;

import com.profolio.backend.dto.request.LoginRequestDto;
import com.profolio.backend.dto.request.RegisterRequestDto;
import com.profolio.backend.dto.response.AuthResponseDto;

public interface AuthService {
    AuthResponseDto register(RegisterRequestDto registerRequestDto);
    AuthResponseDto login(LoginRequestDto loginRequestDto);
}
