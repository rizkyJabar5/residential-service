package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum OwnershipStatus {
    RENT("Sewa"),
    PROPERTY_RIGHTS("Hak Milik");

    private final String status;
}
