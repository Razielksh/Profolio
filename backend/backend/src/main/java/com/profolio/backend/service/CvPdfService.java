package com.profolio.backend.service;

import com.profolio.backend.dto.request.CvExportRequestDto;

public interface CvPdfService {
    byte[] generateCvPdf(CvExportRequestDto request);
}
