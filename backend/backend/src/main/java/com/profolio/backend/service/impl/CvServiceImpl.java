package com.profolio.backend.service.impl;

import com.profolio.backend.dto.request.CvSaveRequestDto;
import com.profolio.backend.dto.response.CvResponseDto;
import com.profolio.backend.entity.*;
import com.profolio.backend.exception.ResourceNotFoundException;
import com.profolio.backend.repository.*;
import com.profolio.backend.service.CvService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CvServiceImpl implements CvService {

    private final CvRepository           cvRepository;
    private final CvExperienceRepository experienceRepository;
    private final CvEducationRepository  educationRepository;
    private final CvSkillRepository      skillRepository;
    private final UserRepository         userRepository;

    @Override
    @Transactional
    public CvResponseDto save(Long userId, CvSaveRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + userId));

        Cv cv;
        boolean isNew = (request.getId() == null);

        if (isNew) {
            cv = Cv.builder()
                    .user(user)
                    .titulo(nullSafe(request.getTitulo(), "Mi CV"))
                    .build();
        } else {
            cv = cvRepository.findByIdAndUserId(request.getId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("CV no encontrado: " + request.getId()));
        }

        // Mapear campos del CV
        cv.setTitulo(nullSafe(request.getTitulo(), "Mi CV"));
        cv.setNombreContacto(request.getNombreContacto());
        cv.setTituloProfesional(request.getTituloProfesional());
        cv.setLinkedinUrl(request.getLinkedinUrl());
        cv.setResumen(request.getResumen());
        cv.setColorPrimario(request.getColorPrimario());

        if (request.getPrivacidad() != null) {
            try {
                cv.setPrivacidad(EPrivacidad.valueOf(request.getPrivacidad().toUpperCase()));
            } catch (IllegalArgumentException e) {
                cv.setPrivacidad(EPrivacidad.PUBLICO);
            }
        }

        Cv savedCv = cvRepository.save(cv);

        // --- Experiencias ---
        if (request.getExperiencias() != null) {
            // Eliminar las antiguas y reinsertar (estrategia simple y confiable)
            if (!isNew) {
                experienceRepository.deleteAll(experienceRepository.findByCvIdOrderByOrdenAsc(savedCv.getId()));
            }
            AtomicInteger orden = new AtomicInteger(0);
            List<CvExperience> experiences = request.getExperiencias().stream()
                    .filter(e -> e.getPuesto() != null || e.getEmpresa() != null)
                    .map(e -> CvExperience.builder()
                            .cv(savedCv)
                            .cargo(nullSafe(e.getPuesto(), "Cargo"))
                            .empresa(nullSafe(e.getEmpresa(), "Empresa"))
                            .descripcion(e.getDescripcion())
                            .orden(orden.getAndIncrement())
                            .build())
                    .collect(Collectors.toList());
            experienceRepository.saveAll(experiences);
        }

        // --- Educación ---
        if (request.getEducacion() != null) {
            if (!isNew) {
                educationRepository.deleteAll(educationRepository.findByCvIdOrderByOrdenAsc(savedCv.getId()));
            }
            AtomicInteger orden = new AtomicInteger(0);
            List<CvEducation> educations = request.getEducacion().stream()
                    .filter(e -> e.getTitulo() != null || e.getColegio() != null)
                    .map(e -> CvEducation.builder()
                            .cv(savedCv)
                            .titulo(nullSafe(e.getTitulo(), "Título"))
                            .institucion(nullSafe(e.getColegio(), "Institución"))
                            .orden(orden.getAndIncrement())
                            .build())
                    .collect(Collectors.toList());
            educationRepository.saveAll(educations);
        }

        // --- Habilidades ---
        if (request.getHabilidades() != null) {
            if (!isNew) {
                skillRepository.deleteAll(skillRepository.findByCvIdOrderByOrdenAsc(savedCv.getId()));
            }
            AtomicInteger orden = new AtomicInteger(0);
            List<CvSkill> skills = request.getHabilidades().stream()
                    .filter(h -> h.getNombre() != null && !h.getNombre().isBlank())
                    .map(h -> CvSkill.builder()
                            .cv(savedCv)
                            .nombre(h.getNombre())
                            .nivel(h.getNivel())
                            .orden(orden.getAndIncrement())
                            .build())
                    .collect(Collectors.toList());
            skillRepository.saveAll(skills);
        }

        return buildResponse(savedCv);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CvResponseDto> findAllByUser(Long userId) {
        return cvRepository.findByUserId(userId).stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CvResponseDto findByIdAndUser(Long cvId, Long userId) {
        Cv cv = cvRepository.findByIdAndUserId(cvId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("CV no encontrado: " + cvId));
        return buildResponse(cv);
    }

    @Override
    @Transactional
    public void delete(Long cvId, Long userId) {
        Cv cv = cvRepository.findByIdAndUserId(cvId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("CV no encontrado: " + cvId));
        experienceRepository.deleteAll(experienceRepository.findByCvIdOrderByOrdenAsc(cvId));
        educationRepository.deleteAll(educationRepository.findByCvIdOrderByOrdenAsc(cvId));
        skillRepository.deleteAll(skillRepository.findByCvIdOrderByOrdenAsc(cvId));
        cvRepository.delete(cv);
    }

    // ---- helpers ----

    private CvResponseDto buildResponse(Cv cv) {
        List<CvResponseDto.ExperienciaDto> exps = experienceRepository.findByCvIdOrderByOrdenAsc(cv.getId())
                .stream().map(e -> CvResponseDto.ExperienciaDto.builder()
                        .id(e.getId())
                        .puesto(e.getCargo())
                        .empresa(e.getEmpresa())
                        .descripcion(e.getDescripcion())
                        .orden(e.getOrden())
                        .build())
                .collect(Collectors.toList());

        List<CvResponseDto.EducacionDto> edus = educationRepository.findByCvIdOrderByOrdenAsc(cv.getId())
                .stream().map(e -> CvResponseDto.EducacionDto.builder()
                        .id(e.getId())
                        .titulo(e.getTitulo())
                        .colegio(e.getInstitucion())
                        .orden(e.getOrden())
                        .build())
                .collect(Collectors.toList());

        List<CvResponseDto.HabilidadDto> skills = skillRepository.findByCvIdOrderByOrdenAsc(cv.getId())
                .stream().map(s -> CvResponseDto.HabilidadDto.builder()
                        .id(s.getId())
                        .nombre(s.getNombre())
                        .nivel(s.getNivel())
                        .orden(s.getOrden())
                        .build())
                .collect(Collectors.toList());

        return CvResponseDto.builder()
                .id(cv.getId())
                .titulo(cv.getTitulo())
                .privacidad(cv.getPrivacidad() != null ? cv.getPrivacidad().name() : "PUBLICO")
                .colorPrimario(cv.getColorPrimario())
                .templateId(cv.getTemplateId())
                .vistas(cv.getVistas())
                .fechaCreacion(cv.getFechaCreacion())
                .fechaModificacion(cv.getFechaModificacion())
                .nombreContacto(cv.getNombreContacto())
                .tituloProfesional(cv.getTituloProfesional())
                .linkedinUrl(cv.getLinkedinUrl())
                .resumen(cv.getResumen())
                .experiencias(exps)
                .educacion(edus)
                .habilidades(skills)
                .build();
    }

    private String nullSafe(String value, String fallback) {
        return (value != null && !value.isBlank()) ? value : fallback;
    }
}
