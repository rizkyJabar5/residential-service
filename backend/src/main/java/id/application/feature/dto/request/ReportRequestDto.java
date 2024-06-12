package id.application.feature.dto.request;

import id.application.feature.dto.response.LetterRequestDto;
import id.application.feature.model.entity.Report;
import lombok.Builder;

import java.io.Serializable;

@Builder
public record ReportRequestDto(
        String name,
        String citizenId,
        String location,
        String imageUrl,
        String typeFacility) implements Serializable {

    public static ReportRequestDto reportRequestDto(Report report) {
        return ReportRequestDto.builder()
                .name(report.getName())
                .citizenId(report.getCitizenId())
                .location(report.getLocation())
                .imageUrl(report.getImageUrl())
                .typeFacility(report.getTypeFacility().getFacility())
                .build();
    }
}
