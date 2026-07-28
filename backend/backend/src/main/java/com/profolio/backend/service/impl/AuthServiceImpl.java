package com.profolio.backend.service.impl;

import com.profolio.backend.dto.request.LoginRequestDto;
import com.profolio.backend.dto.request.RegisterRequestDto;
import com.profolio.backend.dto.response.AuthResponseDto;
import com.profolio.backend.dto.response.UserResponseDto;
import com.profolio.backend.entity.ERole;
import com.profolio.backend.entity.Role;
import com.profolio.backend.entity.User;
import com.profolio.backend.exception.ResourceNotFoundException;
import com.profolio.backend.exception.UserAlreadyExistsException;
import com.profolio.backend.repository.RoleRepository;
import com.profolio.backend.repository.UserRepository;
import com.profolio.backend.security.jwt.JwtTokenProvider;
import com.profolio.backend.security.services.UserDetailsImpl;
import com.profolio.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponseDto register(RegisterRequestDto registerRequestDto) {
        if (userRepository.existsByEmail(registerRequestDto.getEmail())) {
            throw new UserAlreadyExistsException("El correo ya está registrado en el sistema: " + registerRequestDto.getEmail());
        }

        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Error: El rol por defecto ROLE_USER no fue encontrado."));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        User user = User.builder()
                .nombre(registerRequestDto.getName())
                .email(registerRequestDto.getEmail())
                .password(passwordEncoder.encode(registerRequestDto.getPassword()))
                .activo(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        // Autenticar al usuario recién registrado para emitir su token inmediatamente
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequestDto.getEmail(), registerRequestDto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwtToken = jwtTokenProvider.generateToken(authentication);

        Set<String> roleNames = savedUser.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        UserResponseDto userDto = UserResponseDto.builder()
                .id(savedUser.getId())
                .nombre(savedUser.getNombre())
                .name(savedUser.getNombre())
                .email(savedUser.getEmail())
                .fotoUrl(savedUser.getFotoUrl())
                .telefono(savedUser.getTelefono())
                .activo(savedUser.getActivo())
                .fechaRegistro(savedUser.getFechaRegistro())
                .roles(roleNames)
                .build();

        return AuthResponseDto.builder()
                .token(jwtToken)
                .tokenType("Bearer")
                .user(userDto)
                .build();
    }

    @Override
    public AuthResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwtToken = jwtTokenProvider.generateToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        UserResponseDto userDto = UserResponseDto.builder()
                .id(user.getId())
                .nombre(user.getNombre())
                .name(user.getNombre())
                .email(user.getEmail())
                .fotoUrl(user.getFotoUrl())
                .telefono(user.getTelefono())
                .activo(user.getActivo())
                .fechaRegistro(user.getFechaRegistro())
                .roles(roles)
                .build();

        return AuthResponseDto.builder()
                .token(jwtToken)
                .tokenType("Bearer")
                .user(userDto)
                .build();
    }
}
