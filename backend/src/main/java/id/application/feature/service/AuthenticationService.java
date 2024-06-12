package id.application.feature.service;

import id.application.feature.dto.request.CitizenRegisterRequest;
import id.application.feature.dto.request.PasswordRequest;
import id.application.feature.dto.request.RequestValidateRegistration;
import id.application.feature.dto.request.UserRequest;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.model.entity.AppUser;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.transaction.annotation.Transactional;


public interface AuthenticationService extends UserDetailsService {
    @Transactional
    BaseResponse<Void> createNewUser(UserRequest request);

    BaseResponse<Void> registerCitizen(CitizenRegisterRequest request);

    BaseResponse<Void> validateRegistrationCitizen(RequestValidateRegistration request);

    @Transactional
    BaseResponse<Void> resetPassword(String id, PasswordRequest request);

    AppUser getAppUserByUsername(String username);
}
