package id.application.feature.service.impl;

import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.SummaryAdmin;
import id.application.feature.model.repositories.CitizenRepository;
import id.application.feature.model.repositories.LetterRequestRepository;
import id.application.feature.model.repositories.NewsRepository;
import id.application.feature.model.repositories.ReportRepository;
import id.application.feature.service.SummaryService;
import id.application.util.enums.Gender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SummaryServiceImpl implements SummaryService {
    private final CitizenRepository citizenRepository;
    private final LetterRequestRepository letterRepository;
    private final NewsRepository newsRepository;
    private final ReportRepository reportRepository;

    @Override
    public BaseResponse<SummaryAdmin> summaryAdmin() {
        Integer citizen = citizenRepository.countAllCitizen();
        Integer news = newsRepository.countaAllNews();
        Integer letter = letterRepository.countLetterUnapproved();
        Integer report = reportRepository.countAllReport();
        Integer male = citizenRepository.clasificationGender(Gender.MALE);
        Integer female = citizenRepository.clasificationGender(Gender.FEMALE);
        Integer underAge = citizenRepository.clasificationUnderAge();

        return BaseResponse.<SummaryAdmin>builder()
                .data(SummaryAdmin.builder()
                        .citizen(citizen)
                        .news(news)
                        .letter(letter)
                        .report(report)
                        .underAge(underAge)
                        .female(female)
                        .male(male)
                        .build())
                .build();
    }
}
