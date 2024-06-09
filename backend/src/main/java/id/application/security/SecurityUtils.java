package id.application.security;

import com.vaadin.flow.spring.security.AuthenticationContext;
import id.application.exception.UnauthorizedException;
import id.application.feature.dto.response.AppUserDto;
import id.application.feature.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public final class SecurityUtils {
    private final AuthenticationContext authContext;
    private final AuthenticationService authenticationService;

    public Optional<AppUserDto> getAuthenticatedUserDetails() {
        var context = SecurityContextHolder.getContext();
        Object principal = context.getAuthentication().getPrincipal();
        if (principal instanceof Jwt payload) {
            String username = payload.getSubject();
            var user = authenticationService.getAppUserByUsername(username);
            var userInfo = user.getUserInfo();
            return Optional.of(AppUserDto.builder()
                    .name(user.getName())
                    .createdTime(user.getCreatedTime())
                    .email(user.getUsername())
                    .role(user.getRole())
                    .userInfo(userInfo != null ? AppUserDto.UserInfoDto.builder()
                            .phoneNumber(userInfo.getPhoneNumber())
                            .statusRegistered(userInfo.getStatusRegistered())
                            .citizenId(userInfo.getCitizenId())
                            .build() : null)
                    .isCredentialsNonExpired(user.isCredentialsNonExpired())
                    .isEnabled(user.isEnabled())
                    .isAccountNonExpired(user.isAccountNonExpired())
                    .build());
        }
        return Optional.empty();
    }

    public AppUserDto getAppUserLoggedIn() {
        return this.getAuthenticatedUserDetails()
                .orElseThrow(() -> new UnauthorizedException("Anda belum login"));
    }

    public String getUserLoggedIn() {
        return authContext.getPrincipalName()
                .orElseThrow(() -> new UnauthorizedException("Anda belum login"));
    }

    /**
     * For Jwt authentication object.
     * Creates an authentication object with the userDetails then set authentication to
     * SecurityContextHolder.
     *
     * @param request     the {@link HttpServletRequest}
     * @param userDetails the from authentication
     * @param authorities the from authentication
     */
    public <T extends GrantedAuthority> void authenticateUserWithoutCredentials(HttpServletRequest request,
                                                                                UserDetails userDetails,
                                                                                Collection<T> authorities) {
        if (Objects.nonNull(request) && Objects.nonNull(userDetails)) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    authorities);
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }

    /**
     * Clears the securityContextHolder.
     */
    public void clearAuthentication() {
        authContext.logout();
    }

    /**
     * Validates that the user is neither disabled, locked nor expired.
     *
     * @param userDetails the user details
     */
    public void validateUserDetailsStatus(UserDetails userDetails) {
        log.debug("User details {}", userDetails);

        if (!userDetails.isEnabled()) {
            throw new DisabledException("User is disabled");
        }
        if (!userDetails.isAccountNonLocked()) {
            throw new LockedException("User is locked");
        }
        if (!userDetails.isAccountNonExpired()) {
            throw new AccountExpiredException("User is account is is non active");
        }
        if (!userDetails.isCredentialsNonExpired()) {
            throw new CredentialsExpiredException("User credentials expired");
        }
    }

    /**
     * Returns true if the user is authenticated.
     *
     * @return if user is authenticated
     */
    private boolean isAuthenticated() {
        return authContext.isAuthenticated();
    }
}