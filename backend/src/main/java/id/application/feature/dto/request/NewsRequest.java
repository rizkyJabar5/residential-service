package id.application.feature.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;

import java.io.Serializable;

@Builder
public record NewsRequest(
        String title,
        String recipient,
        String event,
        String location,
        @JsonFormat(pattern = "dd/mm/yyyy")
        String eventDate,
        @JsonFormat(pattern = "HH:mm")
        String startTime,
        @JsonFormat(pattern = "HH:mm")
        String endTime,
        String content) implements Serializable {
}
