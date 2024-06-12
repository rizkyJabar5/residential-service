package id.application.seeder;

import id.application.feature.dto.request.RequestCitizenAdd;
import id.application.feature.model.entity.Citizen;
import id.application.feature.service.CitizenService;
import id.application.util.enums.*;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.asm.Advice;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static id.application.security.SecurityUtils.getUserLoggedIn;
import static id.application.util.ConverterDateTime.convertToLocalDateDefaultPattern;
import static id.application.util.EntityUtil.persistUtil;

@Component
@RequiredArgsConstructor
public class CitizenSeeder implements CommandLineRunner {

    private final CitizenService citizenService;

    LocalDate startDate = LocalDate.of(1996, 1, 1);
    LocalDate endDate = LocalDate.of(2000, 12, 31);
    long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
    Random random = new Random();
    long randomDays = random.nextLong(daysBetween);
    LocalDate randomDate = startDate.plusDays(randomDays);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    String dateOfBirth = randomDate.format(formatter);

    @Override
    public void run(String... args) throws Exception {

        for (int i = 1; i <= 50; i++) {
            RequestCitizenAdd request = new RequestCitizenAdd(
                    "kkId " + i,
                    "fullName " + i,
                    "nik " + i,
                    i % 2 == 0 ? Gender.MALE : Gender.FEMALE,
                    "indonesia " + i,
                    dateOfBirth,
                    Religion.values()[i % Religion.values().length],
                    LatestEducation.values()[i % LatestEducation.values().length],
                    FamilyStatus.values()[i % LatestEducation.values().length],
                    "Job Type : " + i,
                    BloodType.values()[i % BloodType.values().length],
                    MarriageStatus.values()[i % MarriageStatus.values().length],
                    "block " + i,
                    i
            );

            citizenService.persistNew(request);
        }

    }

}

