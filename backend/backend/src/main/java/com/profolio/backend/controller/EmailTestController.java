package com.profolio.backend.controller;

import com.profolio.backend.dto.request.EmailTestRequestDto;
import com.profolio.backend.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity<Map<String, String>> testEmail(@Valid @RequestBody EmailTestRequestDto request) {
        String subject = request.getSubject() != null && !request.getSubject().isBlank()
                ? request.getSubject()
                : "Prueba de envío Profolio";

        String body = request.getMessage() != null && !request.getMessage().isBlank()
                ? request.getMessage()
                : "Hola! Este es un correo de prueba enviado desde Spring Boot usando Brevo SMTP Relay.";

        if (request.isHtml()) {
            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;'>"
                    + "<h2 style='color: #006654;'>Profolio - Prueba de Correo</h2>"
                    + "<p>" + body + "</p>"
                    + "<hr style='border: none; border-top: 1px solid #eee;'/>"
                    + "<footer style='font-size: 0.85em; color: #777;'>Enviado desde <strong>noreply@cvgenerador.xyz</strong> vía Brevo SMTP.</footer>"
                    + "</div>";

            emailService.sendHtmlEmail(request.getTo(), subject, htmlContent);
        } else {
            emailService.sendSimpleEmail(request.getTo(), subject, body);
        }

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Correo de prueba enviado correctamente a " + request.getTo(),
                "mode", request.isHtml() ? "HTML" : "TEXT"
        ));
    }
}
