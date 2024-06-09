package id.application.endpoints;

import dev.hilla.Endpoint;
import id.application.feature.dto.request.RequestAddReport;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.Report;
import id.application.feature.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

@RequiredArgsConstructor
@Endpoint
public class ReportEndpoint {
    private final ReportService reportService;

    Page<Report> getAllReport(RequestPagination pagination){
        var contents = reportService.findAll(pagination);
        return contents;
    }

    Page<Report> getReportByDate(String date, RequestPagination pagination) {
        var contents = reportService.findReportByDate(date, pagination);
        return contents;
    }

    Report persistNew(RequestAddReport request){
        Report newContent = reportService.persistNew(request);
        return newContent;
    }
}
