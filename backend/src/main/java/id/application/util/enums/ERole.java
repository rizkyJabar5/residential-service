package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ERole {
    CITIZEN("Warga"),
    SECRETARY_RW("Secretary RW"),
    RW("RW"),
    SECRETARY_RT("Secretary RT"),
    RT("RT"),
    ADMIN("ADMIN");

    private final String name;

    public ERole valuesOf(String name) {
        for (ERole role : ERole.values()) {
            if (role.name.equalsIgnoreCase(name)) {
                return role;
            }
        }
        return null;
    }
}
