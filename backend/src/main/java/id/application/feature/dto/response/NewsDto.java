package id.application.feature.dto.response;

import id.application.feature.model.entity.News;
import lombok.Builder;

import java.io.Serializable;
import java.util.Date;

import static id.application.util.ConverterDateTime.DDDD_DD_MM_YYYY;
import static id.application.util.ConverterDateTime.localDateToLocale;

/**
 * DTO for {@link id.application.feature.model.entity.News}
 */
@Builder
public record NewsDto(
        String id,
        String title,
        String event,
        String eventDate,
        String startTime,
        String endTime,
        String location,
        String content,
        Date publishedAt,
        String publishedBy) implements Serializable {

    public static NewsDto entityToDto(News entity) {
        return NewsDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .event(entity.getEvent())
                .eventDate(localDateToLocale(entity.getEventDate(), DDDD_DD_MM_YYYY))
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .location(entity.getLocation())
                .content(entity.getContent())
                .publishedAt(entity.getCreatedTime())
                .publishedBy(entity.getCreatedBy())
                .build();
    }
}