package com.profolio.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.profolio.backend.dto.request.LoginRequestDto;
import com.profolio.backend.dto.request.RegisterRequestDto;
import com.profolio.backend.dto.response.AuthResponseDto;
import com.profolio.backend.dto.response.UserResponseDto;
import com.profolio.backend.exception.GlobalExceptionHandler;
import com.profolio.backend.exception.UserAlreadyExistsException;
import com.profolio.backend.security.jwt.JwtAccessDeniedHandler;
import com.profolio.backend.security.jwt.JwtAuthenticationEntryPoint;
import com.profolio.backend.security.jwt.JwtTokenProvider;
import com.profolio.backend.security.services.UserDetailsServiceImpl;
import com.profolio.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockitoBean
        private AuthService authService;

        @MockitoBean
        private JwtTokenProvider jwtTokenProvider;

        @MockitoBean
        private UserDetailsServiceImpl userDetailsService;

        @MockitoBean
        private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

        @MockitoBean
        private JwtAccessDeniedHandler jwtAccessDeniedHandler;

        private RegisterRequestDto validRegisterDto;
        private LoginRequestDto validLoginDto;
        private AuthResponseDto mockAuthResponse;

        @BeforeEach
        void setUp() {
                validRegisterDto = RegisterRequestDto.builder()
                                .name("Juan Perez")
                                .email("juan.perez@example.com")
                                .password("Password123!")
                                .build();

                validLoginDto = LoginRequestDto.builder()
                                .email("juan.perez@example.com")
                                .password("Password123!")
                                .build();

                UserResponseDto userDto = UserResponseDto.builder()
                                .id(1L)
                                .name("Juan Perez")
                                .email("juan.perez@example.com")
                                .roles(Set.of("ROLE_USER"))
                                .build();

                mockAuthResponse = AuthResponseDto.builder()
                                .token("mocked-jwt-token")
                                .tokenType("Bearer")
                                .user(userDto)
                                .build();
        }

        @Test
        @DisplayName("POST /api/auth/register debe retornar 201 Created cuando los datos son válidos")
        void register_ShouldReturn201Created_WhenRequestIsValid() throws Exception {
                when(authService.register(any(RegisterRequestDto.class))).thenReturn(mockAuthResponse);

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(validRegisterDto)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.token").value("mocked-jwt-token"))
                                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                                .andExpect(jsonPath("$.user.email").value("juan.perez@example.com"));
        }

        @Test
        @DisplayName("POST /api/auth/register debe retornar 400 Bad Request cuando falla Bean Validation")
        void register_ShouldReturn400BadRequest_WhenValidationFails() throws Exception {
                RegisterRequestDto invalidDto = RegisterRequestDto.builder()
                                .name("") // Vacio
                                .email("email-invalido") // Formato invalido
                                .password("123") // Muy corta (<6)
                                .build();

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidDto)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.error").value("Bad Request"))
                                .andExpect(jsonPath("$.fieldErrors.name").exists())
                                .andExpect(jsonPath("$.fieldErrors.email").exists())
                                .andExpect(jsonPath("$.fieldErrors.password").exists());
        }

        @Test
        @DisplayName("POST /api/auth/register debe retornar 400 Bad Request cuando el email ya existe")
        void register_ShouldReturn400BadRequest_WhenUserAlreadyExists() throws Exception {
                when(authService.register(any(RegisterRequestDto.class)))
                                .thenThrow(new UserAlreadyExistsException(
                                                "El correo ya está registrado en el sistema"));

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(validRegisterDto)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.message").value("El correo ya está registrado en el sistema"));
        }

        @Test
        @DisplayName("POST /api/auth/login debe retornar 200 OK cuando las credenciales son válidas")
        void login_ShouldReturn200OK_WhenCredentialsAreValid() throws Exception {
                when(authService.login(any(LoginRequestDto.class))).thenReturn(mockAuthResponse);

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(validLoginDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.token").value("mocked-jwt-token"))
                                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                                .andExpect(jsonPath("$.user.email").value("juan.perez@example.com"));
        }
}
