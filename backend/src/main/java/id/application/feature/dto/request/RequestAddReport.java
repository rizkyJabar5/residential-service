package id.application.feature.dto.request;

import id.application.util.enums.TypeFacility;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

@Builder
public record RequestAddReport(
        String name,
        String location,
        TypeFacility typeFacility
) implements Serializable {
}
