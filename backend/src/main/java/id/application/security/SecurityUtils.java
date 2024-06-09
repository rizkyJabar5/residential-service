package id.application.security;

import id.application.feature.dto.request.LoginRequest;
import id.application.feature.model.entity.AppUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import java.util.Objects;

@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class SecurityUtils {
    @NotNull
    public static AppUser getUserLoggedIn() {
        if (isAuthenticated()) {
            return (AppUser) getAuthentication().getPrincipal();
        }

        throw new BadCredentialsException("User belum login");
    }

    /**
     * For Jwt authentication object.
     * Creates an authentication object with the userDetails then set authentication to
     * SecurityContextHolder.
     *
     * @param request     the {@link HttpServletRequest}
     * @param userDetails the from authentication
     */
    public static <T extends GrantedAuthority> void authenticateUserWithoutCredentials(HttpServletRequest request,
                                                                                       UserDetails userDetails) {
        if (Objects.nonNull(request) && Objects.nonNull(userDetails)) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }

    public static void authenticateUserCredentials(AuthenticationManager authenticationManager,
                                                   @NonNull LoginRequest request) {
        var authentication = new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password(),
                null);
        var authenticate = authenticationManager.authenticate(authentication);
        SecurityContextHolder.getContext().setAuthentication(authenticate);
    }

    /**
     * Clears the securityContextHolder.
     */
    public static void clearAuthentication() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    /**
     * Validates that the user is neither disabled, locked nor expired.
     *
     * @param userDetails the user details
     */
    public static void validateUserDetailsStatus(UserDetails userDetails) {
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
     * Retrieve the authentication object from the current session.
     *
     * @return authentication
     */
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * Returns true if the user is authenticated.
     *
     * @return if user is authenticated
     */
    private static boolean isAuthenticated() {
        return isAuthenticated(getAuthentication());
    }

    /**
     * Returns true if the user is authenticated.
     *
     * @param authentication the authentication object
     * @return if user is authenticated
     */
    private static boolean isAuthenticated(Authentication authentication) {
        return Objects.nonNull(authentication)
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }
}