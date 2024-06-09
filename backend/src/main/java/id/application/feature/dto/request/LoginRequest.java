package id.application.feature.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Builder;

import java.io.Serializable;

@Builder
public record LoginRequest(
        @Email(message = "Email tidak valid")
        String email,
        String password) implements Serializable {
}
