package id.application.feature.model.entity;

import id.application.util.BaseEntity;
import id.application.util.enums.Gender;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import id.application.util.enums.StatusLetter;
import id.application.util.enums.TypeLetter;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Random;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "letter_request")
public class LetterRequest extends BaseEntity {
    @Column(length = 16)
    private String letterId;

    private String citizenId;

    private String fullName;
    private String placeBirth;
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String nationality;

    @Enumerated(EnumType.STRING)
    private Religion religion;

    private String nik;

    @Enumerated(EnumType.STRING)
    private MarriageStatus marriageStatus;

    private String jobType;
    private String address;

    @Enumerated(EnumType.STRING)
    private TypeLetter type;

    @Enumerated(EnumType.ORDINAL)
    private StatusLetter status;

    public void generateLetterId() {
        var year = Calendar.getInstance().get(Calendar.YEAR);
        var rnd = new Random();
        int random = 1000 + rnd.nextInt(9999);
        this.letterId = String.format("1/BEK/%d/%d", year, random);
    }
}