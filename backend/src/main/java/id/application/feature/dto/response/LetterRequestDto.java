package id.application.feature.dto.response;

import id.application.feature.model.entity.LetterRequest;
import lombok.Builder;

import java.io.Serializable;

@Builder
public record LetterRequestDto(
        String id,
        String letterId,
        String citizenId,
        String fullName,
        String pob,
        String dob,
        String gender,
        String nationality,
        String nik,
        String marriageStatus,
        String jobType,
        String address,
        String type,
        String status ) implements Serializable {

    public static LetterRequestDto letterRequestDto(LetterRequest letterRequest){
        return LetterRequestDto.builder()
                .id(letterRequest.getId())
                .letterId(letterRequest.getLetterId())
                .citizenId(letterRequest.getCitizenId())
                .fullName(letterRequest.getFullName())
                .pob(letterRequest.getPlaceBirth())
                .dob(letterRequest.getPlaceBirth())
                .gender(letterRequest.getGender().getName())
                .nationality(letterRequest.getNationality())
                .nik(letterRequest.getNik())
                .marriageStatus(letterRequest.getMarriageStatus().getStatus())
                .jobType(letterRequest.getJobType())
                .address(letterRequest.getAddress())
                .type(letterRequest.getType().getType())
                .status(letterRequest.getStatus().getStatus())
                .build();
    }
}
