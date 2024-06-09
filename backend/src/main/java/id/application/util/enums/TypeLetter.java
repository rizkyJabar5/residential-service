package id.application.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TypeLetter {
    CARD_FAMILY(1, "Permohonan Kartu Keluarga"),
    PRINT_ID_CARD(2, "Permohonan Rekam/Cetak E-KTP"),
    DOMICILE(3, "Permohonan Surat Keterangan Domisili"),
    BUSINESS(4, "Permohonan Surat Keterangan Usaha"),
    INCAPABLE(5, "Permohonan Surat Keterangan Tidak Mampu(SKTM)"),
    MOVE_OR_COME(6, "Permohonan Surat Pindah/Datang"),
    POLICE_RECORD(7, "Permohonan Surat Pengantar Skck"),
    WEDDING_CONTRACT(8, "Permohonan Surat Mengurus Surat Nikah"),
    CERTIFICATE_OF_BIRTH(9, "Permohonan Surat Keterangan Lahir"),
    DEATH_CERTIFICATE(10, "Permohonan Surat Keterangan Kematian"),
    CROWD_PERMIT(11, "Permohonan Surat Izin Keramaian"),
    OTHERS(12, "Lainnya");

    private final Integer id;
    private final String type;

    public static TypeLetter valueOf(Integer id) {
        for (TypeLetter type : TypeLetter.values()) {
            if (type.id.equals(id)) {
                return type;
            }
        }
        return null;
    }
}
