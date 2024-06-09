package id.application.feature.dto.request;

import id.application.feature.model.entity.Citizen;
import id.application.util.enums.BloodType;
import id.application.util.enums.FamilyStatus;
import id.application.util.enums.Gender;
import id.application.util.enums.LatestEducation;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import lombok.Builder;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link Citizen}
 */

@Builder
public record RequestAddFamilyMember(
        String fullName,
        List<FamilyMember> familyMembers) implements Serializable {

    @Builder
    public record FamilyMember(
            String fullName,
            String nik,
            Gender gender,
            String placeOfBirth,
            String dateOfBirth,
            Religion religion,
            LatestEducation latestEducation,
            FamilyStatus familyStatus,
            String jobType,
            BloodType bloodType,
            MarriageStatus marriageStatus
    ) implements Serializable{}
}