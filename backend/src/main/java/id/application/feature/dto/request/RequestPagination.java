package id.application.feature.dto.request;

import lombok.Builder;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.Serializable;

@Builder
public record RequestPagination(
        Integer page,
        Integer limitContent) implements Serializable {
}
