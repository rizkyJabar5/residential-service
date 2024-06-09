package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TypeFacility {
    GENERAL("Fasilitas Umum"),
    SPECIAL("Fasilitas Khusus");
    private final String facility;
}
