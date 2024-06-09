package id.application.config.pdf;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Slf4j
public class PDFComponentUtil {
    public static String fileName(String name) {
        var localDate = LocalDate.now();
        var extension = "pdf";
        return String.format("Surat Pengantar %s-%s.%s", name, localDate, extension);
    }
}