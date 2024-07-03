package id.application.endpoints;

import id.application.feature.dto.request.*;
import id.application.feature.dto.response.AppUserDto;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.CitizenDto;
import id.application.feature.dto.response.JwtResponse;
import id.application.feature.model.entity.AppUser;
import id.application.feature.service.AuthenticationService;
import id.application.security.SecurityUtils;
import id.application.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static id.application.security.SecurityUtils.authenticateUserCredentials;
import static id.application.security.SecurityUtils.authenticateUserWithoutCredentials;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_FOUND;

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

    @GetMapping("/citizen/{id}")
    public BaseResponse<AppUserDto> getAccountCitizenById(@PathVariable String id) {
        AppUser appUser = userService.getOneAccountCitizen(id);
        return BaseResponse.<AppUserDto>builder()
                .code(CODE_CONTENT_FOUND)
                .message("Data akun warga ditemukan")
                .data(AppUserDto.entityToDto(appUser))
                .build();
    }

    @PostMapping("/citizen/register")
    public BaseResponse<Void> registerCitizen(@Valid @RequestBody CitizenRegisterRequest request) {
        return userService.registerCitizen(request);
    }

    @PutMapping("/update-account-citizen")
    public BaseResponse<Void> updateAccount(@Valid @RequestBody CitizenAccountUpdateRequest request) {
        return userService.updateAccountCitizen(request);
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
    public BaseResponse<Void> logout() {
        SecurityUtils.clearAuthentication();
        return BaseResponse.<Void>builder()
                .code("200")
                .message("You logged out successfully.")
                .build();
    }
}
