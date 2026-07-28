package com.profolio.backend.controller;

import com.profolio.backend.dto.request.LoginRequestDto;
import com.profolio.backend.dto.request.RegisterRequestDto;
import com.profolio.backend.dto.response.AuthResponseDto;
import com.profolio.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto registerRequestDto) {
        AuthResponseDto response = authService.register(registerRequestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        AuthResponseDto response = authService.login(loginRequestDto);
        return ResponseEntity.ok(response);
    }
}
