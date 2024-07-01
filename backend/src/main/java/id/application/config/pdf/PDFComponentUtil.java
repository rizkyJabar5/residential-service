package id.application.config.pdf;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Slf4j
public class PDFComponentUtil {
    public static String fileName(String typeLetter, String name) {
        var localDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-mm-yyyy HH.mm.ss"));
        var extension = "pdf";
        return String.format("%s %s-%s.%s",typeLetter, name, localDate, extension);
    }
}