package id.application.feature.dto.request;

import id.application.util.enums.Gender;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import lombok.Builder;

@Builder
public record TemplateRequest(
        String fullName,
        String pob,
        String dob,
        Gender gender,
        String nationality,
        Religion religion,
        String nik,
        MarriageStatus marriageStatus,
        String jobType,
        String address,
        String typeLetter,
        String letterId,
        String datePublished) {
}
