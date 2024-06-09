package id.application.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class AppConflictException extends RuntimeException {

    public AppConflictException(String message) {
        super(message);
    }

    public AppConflictException(Exception e) {
        super(e);
    }

    public AppConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
