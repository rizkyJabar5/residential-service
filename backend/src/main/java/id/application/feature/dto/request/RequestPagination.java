package id.application.feature.dto.request;

import lombok.Builder;
import org.springframework.data.domain.Sort;

import java.io.Serializable;

@Builder
public record RequestPagination(
        Integer limitContent,
        Integer size,
        Integer pageOf,
        Integer page,
        Sort sort) implements Serializable {
}
