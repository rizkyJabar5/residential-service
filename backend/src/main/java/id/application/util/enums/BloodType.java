package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BloodType {
    A("A"),
    B("B"),
    AB("AB"),
    O("O"),
    NONE("-");

    private final String blood;
}
