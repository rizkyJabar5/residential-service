package id.application.feature.dto.response;

import lombok.Builder;

import java.io.Serializable;

@Builder
public record JwtResponse(
        String accessToken,
        Long expirationAccessToken,
        String type,
        String refreshToken,
        Long expirationRefreshToken,
        String userId,
        String name,
        String username,
        String role,
        String status) implements Serializable {
}
