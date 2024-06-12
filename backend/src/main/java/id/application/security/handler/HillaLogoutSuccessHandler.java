package id.application.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import id.application.feature.dto.response.BaseResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;

@Component
@Slf4j
public class HillaLogoutSuccessHandler implements LogoutSuccessHandler {


    @Override
    public void onLogoutSuccess(HttpServletRequest request,
                                HttpServletResponse response,
                                Authentication authentication) throws IOException, ServletException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ObjectMapper objectMapper = new ObjectMapper();

        if (authentication == null) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            var failureResponse = new HashMap<String, String>();
            failureResponse.put("timestamp", LocalDateTime.now().toString());
            failureResponse.put("message", "You're not logged in");
            failureResponse.put("code", String.valueOf(response.getStatus()));
            failureResponse.put("path", request.getServletPath());
            objectMapper.writeValue(response.getOutputStream(), failureResponse);
            return;
        }

        log.info("User logged out: {}", authentication.getName());

        BaseResponse<Void> baseResponse = BaseResponse.<Void>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .message("Successfully to logout")
                .build();
        objectMapper.writeValue(response.getOutputStream(), baseResponse);
    }
}
