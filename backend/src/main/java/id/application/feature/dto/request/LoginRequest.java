package id.application.feature.dto.request;

import lombok.Builder;

import java.io.Serializable;

@Builder
public record LoginRequest(
        String username,
        String password) implements Serializable {
}
