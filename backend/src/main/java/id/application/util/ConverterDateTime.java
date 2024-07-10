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
import java.util.Locale;
import java.util.Objects;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ConverterDateTime {
    public static final String DD_MM_YYYY = "dd/MM/yyyy";
    public static final String DATETIME_FORMAT = "dd-MM-yyyy HH:mm:ss z";
    public static final String DATE_FORMAT = "dd MMMM yyyy";
    public static final String MONTH_PUBLISH_FORMAT = "mm/yyyy";
    public static final String DDDD_DD_MM_YYYY = "EEEE, dd MMMM yyyy";

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

    public static String localDateToString(LocalDate date, String format) {
        var formatter = new SimpleDateFormat(format);
        var thisMonth = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
        return formatter.format(thisMonth);
    }

    public static String localDateToLocale(LocalDate date, String format) {
        var formatter = DateTimeFormatter.ofPattern(format,  Locale.forLanguageTag("id-ID"));
        return date.format(formatter);
    }

    public static String dateToString(Date date) {
        var formatter = new SimpleDateFormat(DATETIME_FORMAT);
        return formatter.format(date);
    }

    public static LocalDate stringToLocalDate(String date, String format) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        try {
             return LocalDate.parse(date, formatter);
        } catch (Exception e) {
            throw new AppRuntimeException(e.getMessage());
        }
    }
}
