package id.application.feature.dto.response;

import lombok.Builder;

import java.io.Serializable;

@Builder
public record DownloadResponse(
        String fileName,
        byte[] content) implements Serializable {
}
