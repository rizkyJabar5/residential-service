package id.application.feature.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.io.Serializable;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record BaseResponse<T>(
        String responseCode,
        String responseMessage,
        T data) implements Serializable {
}
