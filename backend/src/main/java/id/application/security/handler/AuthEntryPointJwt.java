/*
 * Copyright (c) 2022.
 */

package id.application.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;

import id.application.feature.dto.response.BaseResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static id.application.util.ConverterDateTime.formatDateTime;

@Component
@Slf4j
public class AuthEntryPointJwt implements AuthenticationEntryPoint{

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(response.getStatus());

        var body = BaseResponse.<Void>builder()
                .code(String.valueOf(response.getStatus()))
                .message(authException.getMessage())
                .build();

        log.error("Unauthorized error: {}", authException.getMessage());
        final var mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), body);
    }
}
