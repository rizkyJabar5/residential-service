package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FamilyStatus {
    HEAD_OF_FAMILY("Kepala Keluarga"),
    HUSBAND("Suami"),
    WIFE("Istri"),
    CHILDREN("Anak"),
    SON_IN_LAW("Menantu"),
    GRANDCHILDREN("Cucu"),
    PARENTS("Orang Tua"),
    IN_LAWS("Mertua"),
    OTHER_FAMILIES("Keluarga lain"),
    MAID("Pembantu"),
    OTHERS("Lainnya");

    private final String family;

    public FamilyStatus valuesOf(String family) {
        for (FamilyStatus status : FamilyStatus.values()) {
            if (status.family.equalsIgnoreCase(family)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Family not found");
    }
}


