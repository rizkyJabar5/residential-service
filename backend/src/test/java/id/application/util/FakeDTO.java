package id.application.util;

import id.application.feature.dto.request.LetterAddRequest;
import id.application.util.enums.Gender;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import id.application.util.enums.TypeLetter;

public class FakeDTO {
    public static class Request{
        public static LetterAddRequest buildLetterAddRequest() {
            return LetterAddRequest.builder()
                    .fullName("Agus Suhadi")
                    .pob("Jakarta")
                    .dob("08-10-1965")
                    .gender(Gender.MALE)
                    .nationality("Indonesia")
                    .religion(Religion.ISLAM)
                    .nik("84937903874627164532")
                    .marriageStatus(MarriageStatus.MARRIAGE)
                    .jobType("Swasta")
                    .address("Blok B1/31")
                    .type(TypeLetter.DOMICILE)
                    .build();
        }
    }

    public static class Response{

    }
}
