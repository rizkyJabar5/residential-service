package id.application.feature.dto.request;

import id.application.util.enums.Gender;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import id.application.util.enums.TypeLetter;
import lombok.Builder;

import java.util.List;

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
        List<String> typeLetters,
        String letterId,
        String monthPublished,
        String datePublished) {
}
