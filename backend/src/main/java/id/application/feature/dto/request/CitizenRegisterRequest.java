package id.application.feature.dto.request;

import id.application.feature.model.entity.AppUser;
import id.application.util.annotations.PhoneNumber;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.io.Serializable;

/**
 * DTO for {@link AppUser}
 */
@Builder
public record CitizenRegisterRequest(
        @NotBlank
        @NotNull
        @PhoneNumber(message = "Nomor telepon tidak valid")
        String phoneNumber,
        @NotBlank
        @NotNull
        String kkId) implements Serializable {
}