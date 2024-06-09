package id.application.feature.service;

import id.application.feature.dto.request.RequestAddReport;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.Report;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;

public interface ReportService {
    Page<Report> findAll(RequestPagination pagination);

    Page<Report> findReportByDate(String date, RequestPagination pagination);

    @Transactional
    Report persistNew(RequestAddReport request);
}
