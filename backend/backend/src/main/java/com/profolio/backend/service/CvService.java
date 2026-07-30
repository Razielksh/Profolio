package com.profolio.backend.service;

import com.profolio.backend.dto.request.CvSaveRequestDto;
import com.profolio.backend.dto.response.CvResponseDto;
import java.util.List;

public interface CvService {
    CvResponseDto save(Long userId, CvSaveRequestDto request);
    List<CvResponseDto> findAllByUser(Long userId);
    CvResponseDto findByIdAndUser(Long cvId, Long userId);
    List<CvResponseDto> findPublicCvs();        // Para el directorio del reclutador
    CvResponseDto findPublicCvById(Long cvId);  // Para ver un CV público
    void delete(Long cvId, Long userId);
}
