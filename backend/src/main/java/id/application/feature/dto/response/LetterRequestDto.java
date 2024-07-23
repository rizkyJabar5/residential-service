package id.application.feature.dto.response;

import id.application.feature.model.entity.LetterRequest;
import id.application.util.enums.TypeLetter;
import lombok.Builder;

import java.io.Serializable;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
        String religion,
        String nik,
        String marriageStatus,
        String jobType,
        String address,
        List<String> types,
        String status ) implements Serializable {

    public static LetterRequestDto letterRequestDto(LetterRequest letterRequest){
        return LetterRequestDto.builder()
                .id(letterRequest.getId())
                .letterId(letterRequest.getLetterId())
                .citizenId(letterRequest.getCitizenId())
                .fullName(letterRequest.getFullName())
                .pob(letterRequest.getPlaceBirth())
                .dob(letterRequest.getDateOfBirth().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")))
                .gender(letterRequest.getGender().getName())
                .nationality(letterRequest.getNationality())
                .religion(letterRequest.getReligion().getName())
                .nik(letterRequest.getNik())
                .marriageStatus(letterRequest.getMarriageStatus().getStatus())
                .jobType(letterRequest.getJobType())
                .address(letterRequest.getAddress())
                .types(letterRequest.getTypes().stream().map(TypeLetter::getType).toList())
                .status(letterRequest.getStatus().getStatus())
                .build();
    }
}
