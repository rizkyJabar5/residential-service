package id.application.endpoints;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import id.application.feature.dto.response.AppUserDto;
import id.application.feature.dto.request.PasswordRequest;
import id.application.feature.dto.request.RequestValidateRegistration;
import id.application.feature.dto.request.UserRequest;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.service.AuthenticationService;
import id.application.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Endpoint
@AnonymousAllowed
@RequiredArgsConstructor
public class AuthenticationEndpoint {

    private final AuthenticationService userService;
    private final SecurityUtils securityUtils;

    public BaseResponse<Void> register(@Valid UserRequest request) {
        return userService.createNewUser(request);
    }

    public BaseResponse<Void> validateRegistrationCitizen(RequestValidateRegistration request) {
        return userService.validateRegistrationCitizen(request);
    }

    public BaseResponse<Void> resetPassword(String id,
                                            @Valid PasswordRequest request) {
        return userService.resetPassword(id, request);
    }

    public Optional<AppUserDto> getAuthenticatedUser() {
        return securityUtils.getAuthenticatedUserDetails();
    }

    public String logout() {
        securityUtils.clearAuthentication();
        return "You logged out successfully.";
    }
}
