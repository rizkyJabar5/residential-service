package id.application.feature.dto.request;

import id.application.feature.model.entity.AppUser;
import id.application.util.enums.ERole;
import lombok.Builder;

import java.io.Serializable;

/**
 * DTO for {@link AppUser}
 */
@Builder
public record UserRequest(
        String name,
        String email,
        String password,
        String phoneNumber,
        String kkId,
        ERole role) implements Serializable {
}