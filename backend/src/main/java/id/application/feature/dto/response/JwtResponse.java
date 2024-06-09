package id.application.feature.dto.response;

import lombok.Builder;

import java.io.Serializable;

@Builder
public record JwtResponse(
        String userId,
        String username,
        String accessToken,
        Long expirationAccessToken,
        String type) implements Serializable {
}
