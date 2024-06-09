package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StatusLetter {
    REJECTED(0, "Pengajuan Ditolak"),
    WAITING(1, "Menunggu Review Sekretaris RT"),
    REVIEW_SECRETARY_RT(2, "Sedang direview Sekretaris RT"),
    REVIEW_RT(3, "Sedang direview oleh Sekretaris RT"),
    APPROVED_RT(4, "Pengajuan Disetujui RT"),
    REVIEW_SECRETARY_RW(5, "Sedang direview oleh Sekretaris RW"),
    REVIEW_RW(6, "Sedang direview oleh RW"),
    APPROVED_RW(7, "Pengajuan Telah Disetujui");

    private final int ordinal;
    private final String status;

    public static StatusLetter valueOf(int ordinal) {
        for (StatusLetter status : StatusLetter.values()) {
            if (status.ordinal == ordinal) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status not found");
    }
}
