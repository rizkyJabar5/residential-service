package id.application.feature.model.entity;

import id.application.util.BaseEntity;
import id.application.util.enums.BloodType;
import id.application.util.enums.FamilyStatus;
import id.application.util.enums.Gender;
import id.application.util.enums.LatestEducation;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "citizen")
public class Citizen extends BaseEntity {
    @Column(length=20, nullable = false)
    private String kkId;

    private String fullName;

    @Column(length = 25)
    private String nik;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(length = 20)
    private String placeOfBirth;

    @Temporal(TemporalType.DATE)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Religion religion;

    @Enumerated(EnumType.STRING)
    private LatestEducation latestEducation;

    @Enumerated(EnumType.STRING)
    private FamilyStatus familyStatus;

    @Column(length = 20)
    private String jobType;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private MarriageStatus marriageStatus;

    private String address;

    @Column(length = 10)
    private Integer familyNumber;
}