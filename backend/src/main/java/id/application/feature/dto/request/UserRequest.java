package id.application.feature.dto.request;

import id.application.feature.model.entity.AppUser;
import id.application.util.annotations.PhoneNumber;
import id.application.util.enums.ERole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.io.Serializable;

/**
 * DTO for {@link AppUser}
 */
@Builder
public record UserRequest(
        String name,

        @Email
        String email,

        String password,
        @PhoneNumber
        String phoneNumber,
        String kkId,
        @NotNull
        ERole role) implements Serializable {
}