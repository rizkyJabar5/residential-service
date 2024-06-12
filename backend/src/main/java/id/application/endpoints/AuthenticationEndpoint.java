package id.application.endpoints;

import id.application.feature.dto.request.CitizenRegisterRequest;
import id.application.feature.dto.request.LoginRequest;
import id.application.feature.dto.request.PasswordRequest;
import id.application.feature.dto.request.RequestValidateRegistration;
import id.application.feature.dto.request.UserRequest;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.JwtResponse;
import id.application.feature.service.AuthenticationService;
import id.application.security.SecurityUtils;
import id.application.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static id.application.security.SecurityUtils.authenticateUserCredentials;
import static id.application.security.SecurityUtils.authenticateUserWithoutCredentials;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
@Validated
public class AuthenticationEndpoint {
    private final AuthenticationManager authenticationManager;
    private final AuthenticationService userService;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public BaseResponse<JwtResponse> login(@Valid @RequestBody LoginRequest request,
                                           HttpServletRequest servletRequest) {
        authenticateUserCredentials(authenticationManager, request);
        var appUser = userService.getAppUserByUsername(request.email());
        authenticateUserWithoutCredentials(servletRequest, appUser);
        var loginSuccessResponse = jwtUtils.generateJwtToken(appUser);

        return BaseResponse.<JwtResponse>builder()
                .data(loginSuccessResponse)
                .build();
    }

    @PostMapping("/register")
    public BaseResponse<Void> register(@Valid @RequestBody UserRequest request) {
        return userService.createNewUser(request);
    }

    @PostMapping("/citizen/register")
    public BaseResponse<Void> registerCitizen(@Valid @RequestBody CitizenRegisterRequest request) {
        return userService.registerCitizen(request);
    }

    @PostMapping("/validate-citizen")
    public BaseResponse<Void> validateRegistrationCitizen(@RequestBody RequestValidateRegistration request) {
        return userService.validateRegistrationCitizen(request);
    }

    @PostMapping("/reset-password/{id}")
    public BaseResponse<Void> resetPassword(@PathVariable String id,
                                            @Valid @RequestBody PasswordRequest request) {
        return userService.resetPassword(id, request);
    }

    @PostMapping("/logout")
    public String logout() {
        SecurityUtils.clearAuthentication();
        return "You logged out successfully.";
    }
}
