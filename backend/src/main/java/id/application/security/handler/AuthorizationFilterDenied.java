package id.application.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import id.application.feature.dto.response.BaseResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static id.application.util.ConverterDateTime.formatDateTime;

@Component
@Slf4j
public class AuthorizationFilterDenied implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(response.getStatus());

        var body = BaseResponse.<Void>builder()
                .code(String.valueOf(response.getStatus()))
                .message(accessDeniedException.getMessage())
                .build();

        log.error("Access denied by: {}", accessDeniedException.getMessage());
        final var mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), body);
    }
}
