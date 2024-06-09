package id.application.feature.dto.request;

import id.application.feature.model.entity.Citizen;
import lombok.Builder;

import java.io.Serializable;

/**
 * DTO for {@link Citizen}
 */

@Builder
public record RequestCitizenUpdate(
        String id,
        String name,
        String block,
        Integer homeId,
        Integer familyNumber) implements Serializable {
}