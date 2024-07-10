package id.application.endpoints;

import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.SummaryAdmin;
import id.application.feature.service.SummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/summaries")
@RequiredArgsConstructor
public class SummaryEndpoint {
    private final SummaryService summaryService;

    @GetMapping
    public BaseResponse<SummaryAdmin> summaries() {
        return summaryService.summaryAdmin();
    }
}
