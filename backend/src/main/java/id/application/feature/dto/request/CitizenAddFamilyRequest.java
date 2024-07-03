package id.application.feature.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import id.application.util.enums.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.io.Serializable;

@Builder
public record CitizenAddFamilyRequest(
        @NotNull
        @NotEmpty
        String fullName,
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
        MarriageStatus marriageStatus
        ) implements Serializable {
}
