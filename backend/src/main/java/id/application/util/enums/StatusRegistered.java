package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum StatusRegistered {
    NOT_REGISTERED("Belum Registrasi"),
    VERIFIED("Terverifikasi"),
    REGISTERED("Sudah Registrasi");

    private final String status;
}
