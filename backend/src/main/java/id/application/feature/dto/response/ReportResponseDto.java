package id.application.feature.dto.response;

import id.application.feature.model.entity.Report;
import lombok.Builder;

import java.io.Serializable;

@Builder
public record ReportResponseDto(
        String id,
        String name,
        String citizenId,
        String location,
        String imageUrl,
        String typeFacility
) implements Serializable {

    public static ReportResponseDto reportRequestDto(Report report) {
        return ReportResponseDto.builder()
                .id(report.getId())
                .name(report.getName())
                .citizenId(report.getCitizenId())
                .location(report.getLocation())
                .imageUrl(report.getImageUrl())
                .typeFacility(report.getTypeFacility().getFacility())
                .build();
    }
}
