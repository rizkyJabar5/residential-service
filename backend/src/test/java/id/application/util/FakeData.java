package id.application.util;

import id.application.feature.model.entity.AppUser;
import id.application.feature.model.entity.LetterRequest;
import id.application.feature.model.entity.UserInfo;
import id.application.util.enums.Gender;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import id.application.util.enums.StatusLetter;
import id.application.util.enums.StatusRegistered;
import id.application.util.enums.TypeLetter;

import static id.application.util.ConverterDateTime.convertToLocalDateDefaultPattern;

public class FakeData {

    public static AppUser fakeAppUser() {
        AppUser appUser = new AppUser();
        appUser.setName("Malik Ibrahim");
        appUser.setEmail("test@example.com");

        UserInfo userInfo = new UserInfo();
        userInfo.setPhoneNumber("08972594637");
        userInfo.setStatusRegistered(StatusRegistered.REGISTERED);
        userInfo.setCitizenId("CTZ-001");

        appUser.setUserInfo(userInfo);
        appUser.setCredentialsNonExpired(true);
        appUser.setEnabled(true);
        appUser.setAccountNonExpired(true);

        return appUser;
    }

    public static LetterRequest fakeLetterRequest() {
        var letterRequest = new LetterRequest();
        letterRequest.setId("LTR-001");
        letterRequest.generateLetterId();
        letterRequest.setCitizenId("CTZ-001");
        letterRequest.setFullName("Agus Suhadi");
        letterRequest.setPlaceBirth("Jakarta");
        letterRequest.setDateOfBirth(convertToLocalDateDefaultPattern("18-02-1991"));
        letterRequest.setGender(Gender.MALE);
        letterRequest.setNationality("Indonesia");
        letterRequest.setReligion(Religion.HINDU);
        letterRequest.setNik("84937903874627164532");
        letterRequest.setMarriageStatus(MarriageStatus.UNMARRIAGE);
        letterRequest.setJobType("Pegawai");
        letterRequest.setAddress("Blok A6/87");
        letterRequest.setType(TypeLetter.BUSINESS);
        letterRequest.setStatus(StatusLetter.WAITING);
        return letterRequest;
    }
}
