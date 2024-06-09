package id.application.feature.service.impl;

import id.application.feature.dto.request.UserRequest;
import id.application.feature.model.entity.AppUser;
import id.application.feature.model.entity.UserInfo;
import id.application.feature.model.repositories.AppUserRepository;
import id.application.feature.model.repositories.UserInfoRepository;
import id.application.util.enums.ERole;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.atMostOnce;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceImplTest {
    @InjectMocks
    AuthenticationServiceImpl underTest;

    @Mock
    AppUserRepository appUserRepository;

    @Mock
    UserInfoRepository userInfoRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Test
    void should_Success_Create_New_Citizen() {
        var mockAppUser = mock(AppUser.class);
        var mockUserInfo = mock(UserInfo.class);

        when(appUserRepository.saveAndFlush(any(AppUser.class))).thenReturn(mockAppUser);
        when(userInfoRepository.saveAndFlush(any(UserInfo.class))).thenReturn(mockUserInfo);
        when(mockAppUser.getUserInfo()).thenReturn(mockUserInfo);

        var actualResponse = underTest.createNewUser(buildRequestCitizen(ERole.CITIZEN));

        verify(userInfoRepository, atLeastOnce()).existsByKkId(anyString(), anyString());
        verify(appUserRepository, atLeastOnce()).saveAndFlush(any());
        verify(userInfoRepository, atMostOnce()).saveAndFlush(any());

        assertThat(actualResponse).isNotNull();
        assertThat(mockAppUser.getId()).isEqualTo(mockUserInfo.getId());
        assertThat(mockAppUser.getUserInfo()).isEqualTo(mockUserInfo);
        assertThat(actualResponse.responseMessage()).isEqualTo("Berhasil mendaftarkan akun warga");
    }

    @Test
    void should_Success_Create_New_User() {
        var mockAppUser = mock(AppUser.class);

        when(appUserRepository.saveAndFlush(any(AppUser.class))).thenReturn(mockAppUser);

        var actualResponse = underTest.createNewUser(buildRequestCitizen(ERole.RT));

        verify(appUserRepository, atLeastOnce()).existsUsername(anyString());
        verify(appUserRepository, atLeastOnce()).saveAndFlush(any());

        assertThat(actualResponse).isNotNull();
        assertThat(actualResponse.responseMessage()).isEqualTo("Berhasil mendaftarkan " + ERole.RT);
    }

    @Test
    void should_Error_createNewUser_When_Citizen_Registered() {
        when(userInfoRepository.existsByKkId(anyString(), anyString())).thenReturn(true);

        assertThatThrownBy(() -> underTest.createNewUser(buildRequestCitizen(ERole.CITIZEN)))
                .hasMessage("Warga telah terdaftar");
    }

    @Test
    void should_Error_createNewUser_When_Email_Already_Registered() {
        when(appUserRepository.existsUsername(anyString())).thenReturn(true);

        assertThatThrownBy(() -> underTest.createNewUser(buildRequestCitizen(ERole.RT)))
                .hasMessage("User telah terdaftar");
    }

    private UserRequest buildRequestCitizen(ERole role) {
        return UserRequest.builder()
                .name("Test Name")
                .email("test@email.com")
                .password(passwordEncoder.encode("password"))
                .phoneNumber("082265108492")
                .kkId("13470189045672819856")
                .role(role)
                .build();
    }
}