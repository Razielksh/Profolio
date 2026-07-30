package com.profolio.backend.service;

import com.profolio.backend.dto.request.BrevoEmailRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${BREVO_API_KEY:${brevo.api.key:}}")
    private String brevoApiKey;

    @Value("${BREVO_SENDER_EMAIL:${brevo.sender.email:noreply@cvgenerador.xyz}}")
    private String senderEmail;

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
    private static final String SENDER_NAME = "Profolio";

    public void sendSimpleEmail(String to, String subject, String content) {
        sendViaApi(to, subject, content, null);
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        sendViaApi(to, subject, null, htmlContent);
    }

    private void sendViaApi(String to, String subject, String textContent, String htmlContent) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            log.error("La API Key de Brevo (BREVO_API_KEY) no está configurada.");
            throw new RuntimeException("La API Key de Brevo (BREVO_API_KEY) no está configurada.");
        }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey.trim());

        BrevoEmailRequest request = BrevoEmailRequest.builder()
                .sender(new BrevoEmailRequest.Sender(SENDER_NAME, senderEmail != null && !senderEmail.isBlank() ? senderEmail.trim() : "noreply@cvgenerador.xyz"))
                .to(List.of(new BrevoEmailRequest.Recipient(to)))
                .subject(subject)
                .textContent(textContent)
                .htmlContent(htmlContent)
                .build();

        HttpEntity<BrevoEmailRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(BREVO_API_URL, HttpMethod.POST, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Correo enviado exitosamente vía API REST HTTPS de Brevo a {}", to);
            } else {
                log.error("Error al enviar correo vía API REST: {}", response.getBody());
                throw new RuntimeException("Respuesta de Brevo API no exitosa: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Falló el envío HTTPS a Brevo API: {}", e.getMessage());
            throw new RuntimeException("Falló el envío a Brevo API: " + e.getMessage(), e);
        }
    }
}
