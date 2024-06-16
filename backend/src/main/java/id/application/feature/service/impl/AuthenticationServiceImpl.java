package id.application.feature.service.impl;

import id.application.exception.AppRuntimeException;
import id.application.exception.ResourceNotFoundException;
import id.application.feature.dto.request.CitizenRegisterRequest;
import id.application.feature.dto.request.RequestValidateRegistration;
import id.application.feature.model.entity.AppUser;
import id.application.feature.dto.request.PasswordRequest;
import id.application.feature.dto.request.UserRequest;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.model.entity.UserInfo;
import id.application.feature.model.repositories.AppUserRepository;
import id.application.feature.model.repositories.UserInfoRepository;
import id.application.feature.service.AuthenticationService;
import id.application.util.enums.ERole;
import id.application.util.enums.StatusRegistered;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static id.application.security.SecurityUtils.getUserLoggedIn;
import static id.application.util.EntityUtil.persistUtil;
import static id.application.util.constant.AppConstants.EMAIL_OR_USERNAME_NOT_PROVIDED_MSG;
import static id.application.util.constant.AppConstants.USER_NOT_FOUND_MSG;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserInfoRepository userInfoRepository;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.getAppUserByUsername(username);
    }

    @Override
    public BaseResponse<Void> createNewUser(UserRequest request) {
        var existsUser = this.userRepository.existsUsername(request.email());

        if (existsUser) {
            throw new AppRuntimeException("User telah terdaftar");
        }

        var user = new AppUser();
        user.setEmail(request.email());
        user.setName(request.name());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setAccountNonLocked(true);
        user.setAccountNonExpired(true);
        user.setEnabled(true);
        user.setCredentialsNonExpired(true);

        userRepository.saveAndFlush(user);

        return BaseResponse.<Void>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .message("Berhasil mendaftarkan " + request.role().getName())
                .build();
    }

    @Override
    public BaseResponse<Void> registerCitizen(CitizenRegisterRequest request) {
        var userLoggedIn = getUserLoggedIn();
        var existsAccount = this.userInfoRepository.existsByKkId(request.kkId(), request.phoneNumber());

        if (existsAccount) {
            throw new AppRuntimeException("Warga telah terdaftar");
        }

        var user = new AppUser();
        user.setRole(ERole.CITIZEN);
        user.setAccountNonLocked(true);
        user.setAccountNonExpired(true);
        user.setEnabled(true);
        user.setCredentialsNonExpired(true);
        persistUtil(user, userLoggedIn.getName());
        AppUser appUser = userRepository.saveAndFlush(user);

        persistedUserInfo(request.phoneNumber(), request.kkId(), appUser);

        return BaseResponse.<Void>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .message("Berhasil mendaftarkan akun warga")
                .build();
    }

    @Override
    public BaseResponse<Void> validateRegistrationCitizen(RequestValidateRegistration request) {
        var userInfo = userInfoRepository.findByKkIdAndPhoneNumber(request.kkId(), request.phoneNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Kamu belum terdaftar di aplikasi, silahkan minta bantuan Ketua atau Sekretaris RT/RW "));

        AppUser appUser = userInfo.getAppUser();
        appUser.setEmail(request.email());
        appUser.setPassword(passwordEncoder.encode(request.password()));
        appUser.setName(request.fullName());

        userInfo.setStatusRegistered(StatusRegistered.REGISTERED);

        userInfoRepository.save(userInfo);

        return BaseResponse.<Void>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .message("Kamu berhasil mendaftar")
                .build();
    }

    @Override
    public BaseResponse<Void> resetPassword(String id, PasswordRequest request) {
        var appUser = getAppUserById(id);

        boolean matches = passwordEncoder.matches(request.oldPassword(), appUser.getPassword());
        if (!matches) {
            throw new AppRuntimeException("Password did not match");
        }

        boolean passwordNewMatchWithOldPassword = passwordEncoder.matches(
                request.newPassword(),
                appUser.getPassword()
        );

        if (passwordNewMatchWithOldPassword) {
            throw new AppRuntimeException("Please enter another password!");
        }

        appUser.setPassword(passwordEncoder.encode(request.newPassword()));

        userRepository.save(appUser);

        return BaseResponse.<Void>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .message("Success to change your password")
                .build();
    }

    private AppUser getAppUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException(USER_NOT_FOUND_MSG + " " + userId));
    }

    public AppUser getAppUserByUsername(String username) {
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(EMAIL_OR_USERNAME_NOT_PROVIDED_MSG));
    }

    private void persistedUserInfo(String phoneNumber, String kkId, AppUser appUser) {
        var userInfo = new UserInfo();
        userInfo.setPhoneNumber(phoneNumber);
        userInfo.setAppUser(appUser);
        userInfo.setKkId(kkId);
        userInfo.setStatusRegistered(StatusRegistered.NOT_REGISTERED);
        userInfoRepository.saveAndFlush(userInfo);
    }

    private static <F, E> Object optionalField(F field, E existingData) {
        return field != null
                ? field
                : existingData;
    }
}
