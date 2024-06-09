package id.application.security.handler;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.server.ErrorEvent;
import com.vaadin.flow.server.ErrorHandler;
import com.vaadin.flow.server.ErrorHandlerUtil;
import id.application.exception.AppRuntimeException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomErrorHandler implements ErrorHandler {

    @Override
    public void error(ErrorEvent event) {
        boolean redirected = ErrorHandlerUtil.handleErrorByRedirectingToErrorView(event.getThrowable());
        if (!redirected) {
            // We did not have a matching error view, logging and showing notification.
            log.error("Something wrong happened", event.getThrowable());
            if(UI.getCurrent() != null) {
                UI.getCurrent().access(() -> {
                    throw new AppRuntimeException("");
                });
            }
        }
    }
}
