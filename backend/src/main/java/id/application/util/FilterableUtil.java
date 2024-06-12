package id.application.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class FilterableUtil {

    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_LIMIT = 10;

    public static Pageable pageable(Integer page, Integer limit, Sort sort) {
        if (Objects.isNull(page) || Objects.isNull(limit)) {
            page = DEFAULT_PAGE;
            limit = DEFAULT_LIMIT;

            if (sort == null) {
                return PageRequest.of(page, limit);
            }

            return PageRequest.of(page, limit, sort);
        }
        if (sort == null) {
            return PageRequest.of(page, limit);
        }

        return PageRequest.of(page, limit, sort);
    }

    public static <R, E extends BaseEntity> List<R> mappingContentPage(Page<E> contents, Function<E, R> dtoResponse) {
        return contents.getContent().isEmpty()
                ? Collections.emptyList()
                : contents.getContent().stream()
                .map(dtoResponse).toList();

    }
}
