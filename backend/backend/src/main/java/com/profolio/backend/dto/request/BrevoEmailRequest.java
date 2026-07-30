package com.profolio.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrevoEmailRequest {

    private Sender sender;
    private List<Recipient> to;
    private String subject;
    private String textContent;
    private String htmlContent;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Sender {
        private String name;
        private String email;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Recipient {
        private String email;
    }
}
