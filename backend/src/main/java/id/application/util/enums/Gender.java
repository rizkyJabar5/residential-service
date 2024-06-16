package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Gender {
    FEMALE("Wanita"),
    MALE("Laki-laki");

    private final String name;

    public Gender valuesOf(String family) {
        for (Gender gender : Gender.values()) {
            if (gender.name.equalsIgnoreCase(family)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("Gender not found");
    }
}
