package id.application.feature.dto.response;

import lombok.Builder;

@Builder
public record SummaryAdmin(
        double citizen,
        double report,
        double letter,
        double news,
        double underAge,
        double female,
        double male) {
}
