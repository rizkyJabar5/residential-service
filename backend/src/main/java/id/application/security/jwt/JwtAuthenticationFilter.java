/*
 * Copyright (c) 2022.
 */

package id.application.security.jwt;

import id.application.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().equals("/api/v1/auth/login")
                || request.getServletPath().equals("/api/v1/auth/refreshToken")) {
            filterChain.doFilter(request, response);
            return;
        }
        log.info("Incoming request: {} {}", request.getMethod(), request.getRequestURI());
        String headerAuthorization = request.getHeader(HttpHeaders.AUTHORIZATION);

        try {
            if (Objects.nonNull(headerAuthorization)) {
                String accessToken = jwtUtils.getJwtTokenFromHeader(request);
                var jwtClaimsSet = jwtUtils.parseToken(accessToken);
                String username = jwtClaimsSet.getSubject();

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

//                @SuppressWarnings("unchecked")
//                var roles = (List<Map<String, Object>>) jwtClaimsSet.getClaim("role");
//                var authorities = roles == null ? null : roles.stream()
//                        .map(args -> new SimpleGrantedAuthority(args.get("role").toString()))
//                        .toList();

                SecurityUtils.authenticateUserWithoutCredentials(request, userDetails);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
            response.setStatus(HttpStatus.FORBIDDEN.value());
        }
        filterChain.doFilter(request, response);
    }
}
