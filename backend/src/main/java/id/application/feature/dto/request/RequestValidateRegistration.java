package id.application.feature.dto.request;

import id.application.util.annotations.PhoneNumber;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.io.Serializable;

/**
 * DTO for {@link id.application.feature.model.entity.UserInfo}
 */
@Builder
public record RequestValidateRegistration(
        @NotNull
        @NotEmpty
        @NotBlank
        String kkId,

        @PhoneNumber
        String phoneNumber,

        @NotNull
        @NotBlank
        @Email
        String email,

        @NotNull
        @NotEmpty
        @NotBlank
        String password,

        @NotNull
        @NotEmpty
        @NotBlank
        String fullName) implements Serializable {
}