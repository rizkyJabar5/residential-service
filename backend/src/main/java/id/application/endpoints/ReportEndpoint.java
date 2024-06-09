package id.application.endpoints;

import id.application.feature.dto.request.RequestAddReport;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.Report;
import id.application.feature.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/reports")
@Validated
public class ReportEndpoint {
    private final ReportService reportService;

    @GetMapping
    Page<Report> getAllReport(RequestPagination pagination){
        var contents = reportService.findAll(pagination);
        return contents;
    }

    @PostMapping("/date")
    Page<Report> getReportByDate(@RequestParam String date,
                                 @RequestBody RequestPagination pagination) {
        var contents = reportService.findReportByDate(date, pagination);
        return contents;
    }

    @PostMapping
    Report persistNew(RequestAddReport request){
        Report newContent = reportService.persistNew(request);
        return newContent;
    }
}
