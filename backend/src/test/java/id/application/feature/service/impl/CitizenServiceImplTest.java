package id.application.feature.service.impl;

import com.vaadin.flow.spring.security.AuthenticationContext;
import id.application.exception.AppConflictException;
import id.application.feature.dto.request.RequestAddFamilyMember;
import id.application.feature.dto.request.RequestCitizenAdd;
import id.application.feature.model.entity.Citizen;
import id.application.feature.model.entity.UserInfo;
import id.application.feature.model.repositories.CitizenRepository;
import id.application.feature.model.repositories.UserInfoRepository;
import id.application.util.enums.BloodType;
import id.application.util.enums.FamilyStatus;
import id.application.util.enums.Gender;
import id.application.util.enums.LatestEducation;
import id.application.util.enums.MarriageStatus;
import id.application.util.enums.Religion;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static id.application.util.ConverterDateTime.convertToLocalDateDefaultPattern;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atMostOnce;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CitizenServiceImplTest {
    @InjectMocks
    CitizenServiceImpl underTest;

    @Mock
    CitizenRepository citizenRepository;

    @Mock
    UserInfoRepository userInfoRepository;

    @Mock
    AuthenticationContext authContext;

    @BeforeEach
    void setUp() {
        when(authContext.getPrincipalName()).thenReturn(Optional.of("Admin"));
        ReflectionTestUtils.setField(underTest, "authContext", authContext);
    }

    @Test
    void findAllCitizen() {
        reset(authContext);
        Page<Citizen> mockPage = mock(Page.class);

        when(citizenRepository.findAll(any(Pageable.class))).thenReturn(mockPage);

        var actualCitizens = underTest.findAllCitizen(10, 1);

        verify(citizenRepository).findAll(any(Pageable.class));
        assertThat(actualCitizens.getSize()).isZero();
    }

    @Test
    void findCitizenById() {
        reset(authContext);
    }

    @Test
    void findCitizenByNameLike() {
        reset(authContext);
    }

    @Test
    void should_Success_When_PersistNew() {
        var mockUserInfo = mock(UserInfo.class);
        var request = buildRequestCitizen();

        when(citizenRepository.existsByNik(anyString())).thenReturn(false);
        when(userInfoRepository.findUserInfoByNameAndKkId(anyString(), anyString())).thenReturn(Optional.ofNullable(mockUserInfo));
        when(citizenRepository.save(any())).thenReturn(buildCitizen(request));

        var actualResult = underTest.persistNew(request);

        var captor = ArgumentCaptor.forClass(Citizen.class);
        verify(citizenRepository).save(captor.capture());

        assertThat(actualResult).isNotNull();
        assertThat(actualResult.getKkId()).isEqualTo(captor.getValue().getKkId());
        assertThat(actualResult.getNik()).isEqualTo(captor.getValue().getNik());
    }

    @Test
    void should_Error_PersistNew_When_Nik_Is_Registered() {
        var request = buildRequestCitizen();
        when(citizenRepository.existsByNik(anyString())).thenReturn(true);

        var actualException = assertThrows(AppConflictException.class, () -> underTest.persistNew(request));

        assertThat(actualException.getMessage()).isEqualTo("Data kamu telah terdaftar");
    }

    @Test
    void should_Success_Add_Three_Family_Members() {
        var citizen = buildCitizen(buildRequestCitizen());
        when(citizenRepository.findCitizenByFullName(anyString())).thenReturn(Optional.of(citizen));

        var actualResponse = underTest.addFamilyMembers(buildRequestFamilyMembers());

        ArgumentCaptor<List<Citizen>> captor = ArgumentCaptor.forClass(List.class);
        verify(citizenRepository, atMostOnce()).saveAllAndFlush(captor.capture());

        assertThat(actualResponse.responseMessage()).isEqualTo("Berhasil menambahkan anggota keluarga");
        assertThat(captor.getValue()).hasSize(3);
    }

    @Test
    void updateById() {
        reset(authContext);
    }

    private RequestAddFamilyMember buildRequestFamilyMembers() {
        var members = List.of(
                RequestAddFamilyMember.FamilyMember.builder()
                        .fullName("Sulaiman")
                        .nik("84937903874627164531")
                        .gender(Gender.MALE)
                        .placeOfBirth("Jakarta")
                        .dateOfBirth("11-09-1976")
                        .religion(Religion.ISLAM)
                        .latestEducation(LatestEducation.D3)
                        .familyStatus(FamilyStatus.HUSBAND)
                        .jobType("Swasta")
                        .bloodType(BloodType.O)
                        .marriageStatus(MarriageStatus.MARRIAGE)
                        .build(),
                RequestAddFamilyMember.FamilyMember.builder()
                        .fullName("Mariyati")
                        .nik("84937903874627164532")
                        .gender(Gender.FEMALE)
                        .placeOfBirth("Jakarta")
                        .dateOfBirth("28-05-1987")
                        .religion(Religion.ISLAM)
                        .latestEducation(LatestEducation.D3)
                        .familyStatus(FamilyStatus.WIFE)
                        .jobType("Swasta")
                        .bloodType(BloodType.A)
                        .marriageStatus(MarriageStatus.MARRIAGE)
                        .build(),
                RequestAddFamilyMember.FamilyMember.builder()
                        .fullName("Herman Raharjo")
                        .nik("84937903874627164533")
                        .gender(Gender.MALE)
                        .placeOfBirth("Jakarta")
                        .dateOfBirth("08-11-1999")
                        .religion(Religion.ISLAM)
                        .latestEducation(LatestEducation.D3)
                        .familyStatus(FamilyStatus.CHILDREN)
                        .jobType("Belum Bekerja")
                        .bloodType(BloodType.B)
                        .marriageStatus(MarriageStatus.UNMARRIAGE)
                        .build()
        );
        return RequestAddFamilyMember.builder()
                .fullName("Agus Suhadi")
                .familyMembers(members)
                .build();
    }

    private RequestCitizenAdd buildRequestCitizen() {
        return RequestCitizenAdd.builder()
                .kkId("98376453671038946738")
                .fullName("Agus Suhadi")
                .nik("84937903874627164532")
                .gender(Gender.MALE)
                .placeOfBirth("Jakarta")
                .dateOfBirth("08-10-1965")
                .religion(Religion.ISLAM)
                .latestEducation(LatestEducation.D3)
                .familyStatus(FamilyStatus.HEAD_OF_FAMILY)
                .jobType("Swasta")
                .bloodType(BloodType.A)
                .marriageStatus(MarriageStatus.MARRIAGE)
                .block("B1")
                .homeId(31)
                .build();
    }

    private Citizen buildCitizen(RequestCitizenAdd request) {
        var entity = new Citizen();
        var currentTimestamp = new Date(System.currentTimeMillis());
        entity.setId("CTZ-001");
        entity.setKkId(request.kkId());
        entity.setFullName(request.fullName());
        entity.setNik(request.nik());
        entity.setGender(request.gender());
        entity.setPlaceOfBirth(request.placeOfBirth());
        entity.setDateOfBirth(convertToLocalDateDefaultPattern(request.dateOfBirth()));
        entity.setReligion(request.religion());
        entity.setLatestEducation(request.latestEducation());
        entity.setFamilyStatus(request.familyStatus());
        entity.setJobType(request.jobType());
        entity.setBloodType(request.bloodType());
        entity.setMarriageStatus(request.marriageStatus());
        entity.setBlock(request.block());
        entity.setHomeId(request.homeId());
        entity.setCreatedBy("Admin");
        entity.setCreatedTime(currentTimestamp);
        entity.setUpdatedBy("Admin");
        entity.setUpdatedTime(currentTimestamp);
        entity.setVersion(1);

        return entity;
    }
}