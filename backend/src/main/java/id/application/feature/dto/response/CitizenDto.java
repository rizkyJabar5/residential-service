package id.application.feature.dto.response;

import id.application.feature.model.entity.Citizen;
import lombok.Builder;

import java.io.Serializable;

import static id.application.util.ConverterDateTime.dateToString;

/**
 * DTO for {@link id.application.feature.model.entity.Citizen}
 */
@Builder
public record CitizenDto(
        String kkId,
        String fullName,
        String nik,
        String gender,
        String pob,
        String dob,
        String religion,
        String latestEducation,
        String familyStatus,
        String jobType,
        String bloodType,
        String marriageStatus,
        String homeAddress,
        Integer familyNumber,
        String createdTime,
        String createdBy,
        String updatedTime,
        String updatedBy) implements Serializable {

    public static CitizenDto entityToDto(Citizen citizen) {
        return CitizenDto.builder()
                .kkId(citizen.getKkId())
                .fullName(citizen.getFullName())
                .nik(citizen.getNik())
                .gender(citizen.getGender().getName())
                .pob(citizen.getPlaceOfBirth())
                .dob(citizen.getDateOfBirth().toString())
                .religion(citizen.getReligion().getName())
                .latestEducation(citizen.getLatestEducation().name())
                .familyStatus(citizen.getFamilyStatus().getFamily())
                .jobType(citizen.getJobType())
                .bloodType(citizen.getBloodType().getBlood())
                .marriageStatus(citizen.getMarriageStatus().getStatus())
                .homeAddress(citizen.getHomeAddress())
                .familyNumber(citizen.getFamilyNumber())
                .createdTime(dateToString(citizen.getCreatedTime()))
                .createdBy(citizen.getCreatedBy())
                .updatedTime(dateToString(citizen.getUpdatedTime()))
                .updatedBy(citizen.getUpdatedBy())
                .build();
    }
}