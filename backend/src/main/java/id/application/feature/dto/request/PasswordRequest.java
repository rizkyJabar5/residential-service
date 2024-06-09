package id.application.feature.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.io.Serializable;

@Builder
public record PasswordRequest(
        @NotNull(message = "Old password can't be blank")
        @NotEmpty(message = "Old password can't be blank")
        @NotBlank(message = "Old password can't be blank")
        String oldPassword,

        @NotNull(message = "New password can't be blank")
        @NotEmpty(message = "New password can't be blank")
        @NotBlank(message = "New password can't be blank")
        String newPassword) implements Serializable {

}
