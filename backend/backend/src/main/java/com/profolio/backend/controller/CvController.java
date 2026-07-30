package com.profolio.backend.controller;

import com.profolio.backend.dto.request.CvExportRequestDto;
import com.profolio.backend.dto.request.CvSaveRequestDto;
import com.profolio.backend.dto.response.CvResponseDto;
import com.profolio.backend.entity.User;
import com.profolio.backend.repository.UserRepository;
import com.profolio.backend.service.CvPdfService;
import com.profolio.backend.service.CvService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
public class CvController {

    private final CvPdfService  cvPdfService;
    private final CvService     cvService;
    private final UserRepository userRepository;

    // ── Guardar / actualizar CV ───────────────────────────────────────────────
    @PostMapping("/save")
    public ResponseEntity<CvResponseDto> saveOrUpdate(
            @RequestBody CvSaveRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        CvResponseDto dto = cvService.save(userId, request);
        return ResponseEntity.ok(dto);
    }

    // ── Listar todos los CVs del usuario autenticado ─────────────────────────
    @GetMapping("/my-cvs")
    public ResponseEntity<List<CvResponseDto>> getMyCvs(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(cvService.findAllByUser(userId));
    }

    // ── Obtener un CV específico del usuario ─────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<CvResponseDto> getCv(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(cvService.findByIdAndUser(id, userId));
    }

    // ── Eliminar CV ──────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCv(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        cvService.delete(id, userId);
        return ResponseEntity.ok(Map.of("message", "CV eliminado correctamente"));
    }

    // ── Exportar PDF ─────────────────────────────────────────────────────────
    @PostMapping("/export-pdf")
    public ResponseEntity<byte[]> exportPdf(@RequestBody CvExportRequestDto request) {
        byte[] pdfBytes = cvPdfService.generateCvPdf(request);

        String fileName = "Curriculum_Vitae.pdf";
        if (request.getPersonal() != null && request.getPersonal().getNombre() != null) {
            fileName = "CV_" + request.getPersonal().getNombre().replaceAll("\\s+", "_") + ".pdf";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", fileName);
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return user.getId();
    }
}
