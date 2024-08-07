package id.application.security.jwt;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import id.application.exception.AppRuntimeException;
import id.application.feature.dto.response.JwtResponse;
import id.application.feature.model.entity.AppUser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;

import static id.application.util.constant.AppConstants.CANNOT_BE_BLANK;
import static id.application.util.constant.SecurityConst.ACCESS_TOKEN_EXPIRATION_TIME_MS;
import static id.application.util.constant.SecurityConst.REFRESH_TOKEN_CREATED_SUCCESS;
import static id.application.util.constant.SecurityConst.REFRESH_TOKEN_EXPIRATION_TIME_MS;
import static id.application.util.constant.SecurityConst.TOKEN_CREATED_SUCCESS;
import static id.application.util.constant.SecurityConst.TOKEN_PREFIX;


@RequiredArgsConstructor
@Component
@Slf4j
public class JwtUtils {
    @Value("${jwt.secretKey}")
    private String secretKey;

    public JwtResponse generateJwtToken(AppUser appUser) {
        String username = appUser.getUsername();
        Validate.notBlank(username, CANNOT_BE_BLANK);
        JWTClaimsSet claimsSetAccessToken = new JWTClaimsSet.Builder()
                .subject(username)
                .issuer("residential-management.id")
                .claim("authorities", appUser.getAuthorities())
                .issueTime(new Date())
                .expirationTime(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_TIME_MS))
                .build();
        String accessToken = generateAccessToken(claimsSetAccessToken);
        log.info(TOKEN_CREATED_SUCCESS, accessToken);

        JWTClaimsSet claimsSetRefreshToken = new JWTClaimsSet.Builder()
                .subject(username)
                .issueTime(new Date())
                .expirationTime(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME_MS))
                .build();
        String refreshToken = generateAccessToken(claimsSetRefreshToken);
        log.info(REFRESH_TOKEN_CREATED_SUCCESS, refreshToken);

        long durationExpiredAccessToken = claimsSetAccessToken.getExpirationTime().getTime() - claimsSetAccessToken.getIssueTime().getTime();
        long durationExpiredRefreshToken = claimsSetRefreshToken.getExpirationTime().getTime() - claimsSetRefreshToken.getIssueTime().getTime();

        return JwtResponse.builder()
                .userId(appUser.getId())
                .username(username)
                .name(appUser.getName())
                .role(appUser.getRole().name())
                .accessToken(accessToken)
                .expirationAccessToken(durationExpiredAccessToken)
                .refreshToken(refreshToken)
                .expirationRefreshToken(durationExpiredRefreshToken)
                .type(TOKEN_PREFIX.trim())
                .status("ADMIN".equals(appUser.getRole().name()) ? null : appUser.getUserInfo().getStatusRegistered().name())
                .build();
    }

    public String getJwtTokenFromHeader(HttpServletRequest request) {
        String headerAuth = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (StringUtils.isNotBlank(headerAuth)
                && headerAuth.startsWith(TOKEN_PREFIX)) {
            return headerAuth.substring(7); // 10 day of expired at token
        }
        return null;
    }

    public JWTClaimsSet parseToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            byte[] secretKeyBytes = secretKey.getBytes();
            signedJWT.verify(new MACVerifier(secretKeyBytes));
            ConfigurableJWTProcessor<SecurityContext> jwtProcessor = new DefaultJWTProcessor<>();
            JWSKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(
                    JWSAlgorithm.HS256,
                    new ImmutableSecret<>(secretKeyBytes));
            jwtProcessor.setJWSKeySelector(keySelector);
            jwtProcessor.process(signedJWT, null);

            return signedJWT.getJWTClaimsSet();
        } catch (ParseException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            throw new AppRuntimeException(e.getMessage());
        } catch (BadJOSEException e) {
            log.error("JWT token is expired: {}", e.getMessage());
            throw new AppRuntimeException(e.getMessage());
        } catch (JOSEException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
            throw new AppRuntimeException(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
            throw new AppRuntimeException(e.getMessage());
        }
    }

    private String generateAccessToken(JWTClaimsSet jwtClaimsSet) {
        try {
            Payload payload = new Payload(jwtClaimsSet.toJSONObject());
            JWSObject jwsObject = new JWSObject(new JWSHeader(JWSAlgorithm.HS256), payload);
            jwsObject.sign(new MACSigner(secretKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new AppRuntimeException(e);
        }
    }
}
