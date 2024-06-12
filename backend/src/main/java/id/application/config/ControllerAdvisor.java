package id.application.config;

import id.application.exception.AppConflictException;
import id.application.exception.AppRuntimeException;
import id.application.exception.InternalServerException;
import id.application.exception.ResourceNotFoundException;
import id.application.feature.dto.response.BaseResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.handler.ResponseStatusExceptionHandler;

@RestControllerAdvice
public class ControllerAdvisor extends ResponseStatusExceptionHandler {
    @ExceptionHandler({AppRuntimeException.class, AppConflictException.class,
            ResourceNotFoundException.class, DataIntegrityViolationException.class,
            InternalServerException.class, NumberFormatException.class, AuthenticationException.class})
    public ResponseEntity<Object> illegalActionDataHandler(RuntimeException exception) {
        var response = BaseResponse.<Void>builder()
                .code(String.valueOf(HttpStatus.CONFLICT.value()))
                .message(exception.getMessage())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        var message = new StringBuilder();
        ex.getBindingResult().getFieldErrors()
                .stream().findFirst()
                .ifPresent(fieldError -> {
                    String defaultMessage = fieldError.getDefaultMessage();
                    String field = fieldError.getField();
                    message.append("Field ")
                            .append(StringUtils.capitalize(field))
                            .append(": ")
                            .append(defaultMessage);
                });

        var response = BaseResponse.<Void>builder()
                .code(String.valueOf(HttpStatus.CONFLICT.value()))
                .message(message.toString())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
}
