package id.application.util.enums;

import lombok.Getter;

@Getter
public enum Gender {
    FEMALE("Wanita"),
    MALE("Laki-laki");

    private final String name;
    Gender(String name) {
        this.name = name;
    }
}
