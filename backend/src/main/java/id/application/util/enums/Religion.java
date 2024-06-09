package id.application.util.enums;

import lombok.Getter;

@Getter
public enum Religion {
    ISLAM("Islam"),
    KATOLIK("Katolik"),
    PROTESTAN("Protestan"),
    HINDU("Hindu"),
    BUDDHA("Buddha");

    private final String name;

    Religion(String name) {
        this.name = name;
    }
}
