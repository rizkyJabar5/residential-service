package id.application.feature.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.io.Serializable;

@Builder
public record UpdateLetterStatusRequest(
        @NotNull
        String letterId,
        int status) implements Serializable {
}
