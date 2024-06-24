package id.application.config.pdf;

import id.application.feature.dto.request.TemplateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class TemplateConfig {
    private final SpringTemplateEngine templateEngine;

    public String ruEnrichProcessor(TemplateRequest request) {
        var arg = this.mappingArgument(request);
        var context = new Context();
        context.setLocale(Locale.ENGLISH);
        context.setVariables(arg);

        return this.templateEngine.process("template-letter", context);
    }

    private Map<String, Object> mappingArgument(TemplateRequest request) {
        var argument = new HashMap<String, Object>();
        argument.put("fullName", request.fullName());
        argument.put("pobAndDob", String.format("%s/%s",request.pob(), request.dob()));
        argument.put("gender", request.gender().getName());
        argument.put("nationalityAndReligion", String.format("%s / %s", request.nationality(), request.religion().getName()));
        argument.put("nik", request.nik());
        argument.put("marriageStatus", request.marriageStatus().getStatus());
        argument.put("jobType", request.jobType());
        argument.put("address", request.address());
        argument.put("type", request.typeLetter());
        argument.put("letterId", request.letterId());
        argument.put("datePublished", request.datePublished());
        return argument;
    }
}
