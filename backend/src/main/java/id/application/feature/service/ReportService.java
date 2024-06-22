package id.application.feature.service;

import id.application.feature.dto.request.RequestAddReport;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.Report;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface ReportService {
    Page<Report> findAll(RequestPagination request);

    Page<Report> findReportByDate(String date, RequestPagination request);

    @Transactional
    Report persistNew(RequestAddReport request, MultipartFile image);
}
