package id.application.feature.service;

import id.application.feature.dto.request.*;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.model.entity.AppUser;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.transaction.annotation.Transactional;


public interface AuthenticationService extends UserDetailsService {
    @Transactional
    BaseResponse<Void> createNewUser(UserRequest request);

    AppUser getOneAccountCitizen(String id);

    @Transactional
    BaseResponse<Void> registerCitizen(CitizenRegisterRequest request);

    @Transactional
    BaseResponse<Void> updateAccountCitizen(CitizenAccountUpdateRequest request);

    @Transactional
    BaseResponse<Void> validateRegistrationCitizen(RequestValidateRegistration request);

    @Transactional
    BaseResponse<Void> resetPassword(String id, PasswordRequest request);

    AppUser getAppUserByUsername(String username);

}
