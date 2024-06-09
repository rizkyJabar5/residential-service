package id.application.feature.dto.request;

import lombok.Builder;

import java.io.Serializable;

/**
 * DTO for {@link id.application.feature.model.entity.UserInfo}
 */
@Builder
public record RequestValidateRegistration(
        String kkId,
        String phoneNumber,
        String email,
        String password,
        String fullName) implements Serializable {
}