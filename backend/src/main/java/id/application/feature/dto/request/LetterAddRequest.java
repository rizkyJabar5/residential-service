package id.application.feature.dto.request;

import id.application.util.enums.Gender;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import id.application.util.enums.TypeLetter;
import lombok.Builder;

import java.io.Serializable;

/**
 * DTO for {@link id.application.feature.model.entity.LetterRequest}
 */
@Builder
public record LetterAddRequest(
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
        TypeLetter type) implements Serializable {
}