package id.application.feature.service.impl;

import com.vaadin.flow.spring.security.AuthenticationContext;
import id.application.exception.AppConflictException;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.AppUser;
import id.application.feature.model.entity.LetterRequest;
import id.application.feature.model.repositories.LetterRequestRepository;
import id.application.feature.service.AuthenticationService;
import id.application.security.SecurityUtils;
import id.application.util.enums.StatusLetter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static id.application.util.FakeDTO.Request.buildLetterAddRequest;
import static id.application.util.FakeData.fakeAppUser;
import static id.application.util.FakeData.fakeLetterRequest;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LetterServiceImplTest {
    @InjectMocks
    LetterServiceImpl underTest;

    @Mock
    LetterRequestRepository repository;

    @Spy
    AuthenticationContext authContext;

    @Spy
    AuthenticationService authenticationService;

    SecurityUtils securityUtil = new SecurityUtils(authContext, authenticationService);

    @BeforeEach
    void setUp() {
        var mockAppUser = fakeAppUser();
        ReflectionTestUtils.setField(underTest, "securityUtil", securityUtil);
        when(authContext.isAuthenticated()).thenReturn(true);
        ReflectionTestUtils.setField(securityUtil, "authContext", authContext);
        when(authenticationService.loadUserByUsername(anyString())).thenReturn(mockAppUser);
        when(authContext.getAuthenticatedUser(AppUser.class)).thenReturn(Optional.of(mockAppUser));
        ReflectionTestUtils.setField(securityUtil, "appUserService", authenticationService);
    }

    @Test
    void findAll() {
        var fakeLetterRequest = fakeLetterRequest();
        Page<LetterRequest> mockPage = mock(Page.class);
        when(repository.findAll(any(Pageable.class))).thenReturn(mockPage);

        var actualResponse = underTest.findAll(RequestPagination.builder().build());
        assertThat(actualResponse.getTotalPages()).isEqualTo(0);
        assertThat(actualResponse.getTotalElements()).isEqualTo(0);
        assertThat(actualResponse.getSize()).isEqualTo(0);
        assertThat(actualResponse.getContent()).isEmpty();
    }

    @Test
    void should_Success_findLetterByStatus() {
        var fakeLetterRequest = fakeLetterRequest();
        Page<LetterRequest> mockPage = mock(Page.class);
        when(repository.findByLetterStatus(any(), any())).thenReturn(mockPage);

        var actualResponse = underTest.findLetterByStatus(StatusLetter.APPROVED_RW);
        assertThat(actualResponse.getTotalPages()).isEqualTo(0);
        assertThat(actualResponse.getTotalElements()).isEqualTo(0);
        assertThat(actualResponse.getSize()).isEqualTo(0);
        assertThat(actualResponse.getContent()).isEmpty();
    }

    @Test
    void should_Success_findById() {
        var fakeLetterRequest = fakeLetterRequest();

        when(repository.findById(anyString())).thenReturn(Optional.of(fakeLetterRequest));

        var actualResponse = underTest.findById("LTR-001");
        assertThat(actualResponse.getFullName()).isEqualTo("Agus Suhadi");
        assertThat(actualResponse.getNik()).isEqualTo("84937903874627164532");
        assertThat(actualResponse.getStatus()).isEqualTo(StatusLetter.WAITING);
        assertThat(actualResponse.getCitizenId()).isEqualTo("CTZ-001");
    }

    @Test
    void should_Success_findByLetterId() {
        var fakeLetterRequest = fakeLetterRequest();

        when(repository.findByLetterId(anyString())).thenReturn(Optional.of(fakeLetterRequest));

        var actualResponse = underTest.findByLetterId("84937903874627164532");
        assertThat(actualResponse.getFullName()).isEqualTo("Agus Suhadi");
        assertThat(actualResponse.getNik()).isEqualTo("84937903874627164532");
        assertThat(actualResponse.getStatus()).isEqualTo(StatusLetter.WAITING);
        assertThat(actualResponse.getCitizenId()).isEqualTo("CTZ-001");
    }

    @Test
    void should_Success_persistNew() {
        var request = buildLetterAddRequest();
        var fakeLetterRequest = fakeLetterRequest();

        when(repository.existByNikAndType(anyString(), any())).thenReturn(Boolean.FALSE);
        when(repository.findLetterRejected(anyString())).thenReturn(Optional.of(new LetterRequest()));
        when(repository.saveAndFlush(any())).thenReturn(fakeLetterRequest);

        var actualResponse = underTest.persistNew(request);

        var captor = ArgumentCaptor.forClass(LetterRequest.class);
        verify(repository, atLeastOnce()).saveAndFlush(captor.capture());

        assertThat(actualResponse.getFullName()).isEqualTo(captor.getValue().getFullName());
        assertThat(actualResponse.getNik()).isEqualTo(captor.getValue().getNik());
        assertThat(actualResponse.getStatus()).isEqualTo(captor.getValue().getStatus());
        assertThat(actualResponse.getCitizenId()).isEqualTo("CTZ-001");
    }


    @Test
    void should_Error_persistNew_When_Already_Letter_Request() {
        var request = buildLetterAddRequest();
        when(repository.existByNikAndType(anyString(), any())).thenReturn(Boolean.TRUE);
        var actualException = assertThrows(AppConflictException.class, () -> underTest.persistNew(request));
        assertThat(actualException.getMessage()).isEqualTo("Anda sudah mengajukan surat pengajuan. Silahkan ditunggu status pengajuan sebelumnya");
    }
}