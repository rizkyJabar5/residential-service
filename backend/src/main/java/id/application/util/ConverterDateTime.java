package id.application.util;

import id.application.exception.AppRuntimeException;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Objects;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ConverterDateTime {
    public static final String DD_MM_YYYY = "dd/MM/yyyy";
    public static final String DATETIME_FORMAT = "dd-MM-yyyy HH:mm:ss z";

    public static LocalDate convertToLocalDateDefaultPattern(String date) {
        if (Objects.isNull(date)) {
            return null;
        }
        try {
            return LocalDate.parse(
                    date,
                    DateTimeFormatter.ofPattern(DD_MM_YYYY));
        } catch (Exception e) {
            long m = Long.parseLong(date);
            return LocalDate.ofInstant(Instant.ofEpochMilli(m), ZoneId.systemDefault());
        }
    }

    public static DateTimeFormatter formatDateTime() {

        return DateTimeFormatter
                .ofPattern(DATETIME_FORMAT)
                .withZone(ZoneId.of("Asia/Jakarta"));
    }

    public static Date convertToDateDefaultPattern(String date) {
        if (Objects.isNull(date)) {
            return null;
        }
        try {
            LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ofPattern(DD_MM_YYYY));
            return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        } catch (Exception e) {
            throw new AppRuntimeException(e.getMessage());
        }
    }

    public static Date today() {
        final Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 0);
        return cal.getTime();
    }

    public static String localDateToString(LocalDate date) {
        var formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        return date.format(formatter);
    }

    public static String dateToString(Date date) {
        var formatter = new SimpleDateFormat(DATETIME_FORMAT);
        return formatter.format(date);
    }
}
