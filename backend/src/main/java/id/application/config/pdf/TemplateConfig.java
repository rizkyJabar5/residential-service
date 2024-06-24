package id.application.config.pdf;

import id.application.feature.dto.request.LetterAddRequest;
import id.application.util.enums.TypeLetter;
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

    public String ruEnrichProcessor(LetterAddRequest request) {
        var arg = this.mappingArgument(request);
        var context = new Context();
        context.setLocale(Locale.ENGLISH);
        context.setVariables(arg);

        return this.templateEngine.process("template-letter", context);
    }

    private Map<String, Object> mappingArgument(LetterAddRequest request) {
        var argument = new HashMap<String, Object>();
        argument.put("fullName", request.fullName());
        argument.put("pob", request.pob());
        argument.put("dob", request.dob());
        argument.put("gender", request.gender());
        argument.put("nationality", request.nationality());
        argument.put("religion", request.religion());
        argument.put("nik", request.nik());
        argument.put("marriageStatus", request.marriageStatus());
        argument.put("jobType", request.jobType());
        argument.put("address", request.address());
        argument.put("type", TypeLetter.valueOf(request.type()));
        return argument;
    }
}
