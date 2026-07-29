package com.profolio.backend.controller;

import com.profolio.backend.dto.request.CvExportRequestDto;
import com.profolio.backend.service.CvPdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
public class CvController {

    private final CvPdfService cvPdfService;

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
}
