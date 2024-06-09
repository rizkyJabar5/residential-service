package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MarriageStatus {
    MARRIAGE("Kawin"),
    UNMARRIAGE("Belum Kawin");

    private final String status;
}
