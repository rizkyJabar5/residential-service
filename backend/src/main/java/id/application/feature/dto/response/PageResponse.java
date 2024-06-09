package id.application.feature.dto.response;

import lombok.Builder;

import java.io.Serializable;
import java.util.List;

@Builder
public record PageResponse<T>(
        Integer size,
        Long totalElements,
        Integer totalPages,
        Integer numberOfElements,
        Integer pageOf,
        Integer page,
        List<T> content) implements Serializable {
}
