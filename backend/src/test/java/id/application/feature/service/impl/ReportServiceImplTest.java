package id.application.feature.service.impl;

import com.vaadin.flow.spring.security.AuthenticationContext;
import id.application.config.CloudinaryConfig;
import id.application.feature.dto.response.AppUserDto;
import id.application.feature.dto.request.RequestAddReport;
import id.application.feature.model.entity.AppUser;
import id.application.feature.model.entity.Report;
import id.application.feature.model.entity.UserInfo;
import id.application.feature.model.repositories.ReportRepository;
import id.application.feature.service.AuthenticationService;
import id.application.security.SecurityUtils;
import id.application.util.enums.ERole;
import id.application.util.enums.StatusRegistered;
import id.application.util.enums.TypeFacility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceImplTest {
    @InjectMocks
    ReportServiceImpl underTest;

    @Mock
    ReportRepository reportRepository;

    @Mock
    CloudinaryConfig cloudinaryConfig;

    @Spy
    AuthenticationContext authContext;

    @Spy
    AuthenticationService authenticationService;

    SecurityUtils securityUtil = new SecurityUtils(authContext, authenticationService);

    @BeforeEach
    void setUp() {
        var mockAppUser = buildAppUser();
        ReflectionTestUtils.setField(underTest, "securityUtil", securityUtil);
        when(authContext.isAuthenticated()).thenReturn(true);
        ReflectionTestUtils.setField(securityUtil, "authContext", authContext);
        when(authenticationService.loadUserByUsername(anyString())).thenReturn(mockAppUser);
        when(authContext.getAuthenticatedUser(AppUser.class)).thenReturn(Optional.of(mockAppUser));
        ReflectionTestUtils.setField(securityUtil, "appUserService", authenticationService);
    }

    @Test
    void findAll() {
        reset(authContext, authenticationService);
    }

    @Test
    void findReportByDate() {
        reset(authContext, authenticationService);
    }

    @Test
    void testPersistNew_shouldSaveReport() {
        var mockImage = mock(MultipartFile.class);
        var request = buildRequest(mockImage);
        var expectedUrl = "https://cloudinary.com/image.jpg";
        var expectedReport = buildReport();

        when(cloudinaryConfig.upload(any(), any())).thenReturn(Collections.singletonMap("url", expectedUrl));
        when(reportRepository.saveAndFlush(any())).thenReturn(expectedReport);


        var actualResponse = underTest.persistNew(request);

        assertThat(actualResponse).isNotNull();
        var captor = ArgumentCaptor.forClass(Report.class);
        verify(reportRepository).saveAndFlush(captor.capture());

        assertThat(actualResponse.getName()).isEqualTo(captor.getValue().getName());
        assertThat(actualResponse.getLocation()).isEqualTo(captor.getValue().getLocation());
        assertThat(actualResponse.getImageUrl()).isEqualTo(expectedUrl);
        assertThat(actualResponse.getTypeFacility()).isEqualTo(captor.getValue().getTypeFacility());
        assertThat(actualResponse.getCitizenId()).isEqualTo("CTZ-001");
    }

    private Report buildReport() {
        return new Report(
                "Pos Kamling roboh",
                "CTZ-001",
                "Depan Masjid Al-Mubarok",
                "https://cloudinary.com/image.jpg",
                TypeFacility.GENERAL
        );
    }

    private RequestAddReport buildRequest(MultipartFile image) {
        return RequestAddReport.builder()
                .title("Pos Kamling roboh")
                .location("Depan Masjid Al-Mubarok")
                .image(image)
                .typeFacility(TypeFacility.GENERAL)
                .build();

    }

    private AppUserDto buildUserDto() {
        return AppUserDto.builder()
                .name("Test User")
                .createdTime(new Date(System.currentTimeMillis()))
                .email("test@email.com")
                .role(ERole.CITIZEN)
                .userInfo(AppUserDto.UserInfoDto.builder()
                        .phoneNumber("08972594637")
                        .statusRegistered(StatusRegistered.REGISTERED)
                        .citizenId("TEST-001")
                        .build())
                .isCredentialsNonExpired(true)
                .isEnabled(true)
                .isAccountNonExpired(true)
                .build();
    }

    private AppUser buildAppUser() {
        AppUser appUser = new AppUser();
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
}