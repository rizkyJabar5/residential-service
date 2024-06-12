package id.application.feature.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import id.application.feature.model.entity.Citizen;
import id.application.util.enums.BloodType;
import id.application.util.enums.FamilyStatus;
import id.application.util.enums.Gender;
import id.application.util.enums.LatestEducation;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.io.Serializable;

/**
 * DTO for {@link Citizen}
 */

@Builder
public record CitizenInfoRequest(
        @NotBlank
        @NotNull
        String kkId,
        @NotNull @NotEmpty String fullName,
        String nik,
        Gender gender,
        String placeOfBirth,
        @JsonFormat(pattern = "dd/mm/yyyy")
        String dateOfBirth,
        Religion religion,
        LatestEducation latestEducation,
        FamilyStatus familyStatus,
        String jobType,
        BloodType bloodType,
        MarriageStatus marriageStatus,
        String block,
        Integer homeId) implements Serializable {
}