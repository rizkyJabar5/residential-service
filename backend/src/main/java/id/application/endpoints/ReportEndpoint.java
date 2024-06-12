package id.application.endpoints;

import id.application.feature.dto.request.ReportRequestDto;
import id.application.feature.dto.request.RequestAddReport;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.LetterRequestDto;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.model.entity.Report;
import id.application.feature.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static id.application.util.FilterableUtil.mappingContentPage;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_EMPTY;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/reports")
@Validated
public class ReportEndpoint {
    private final ReportService reportService;


    @GetMapping
    public BaseResponse<PageResponse<ReportRequestDto>> getAllReports(@RequestParam(defaultValue = "0") Integer page,
                                                    @RequestParam(defaultValue = "10") Integer limitedContent) {
        var report = reportService.findAll(RequestPagination.builder()
                .page(page)
                .limitContent(limitedContent)
                .build()
        );

        return BaseResponse.<PageResponse<ReportRequestDto>>builder()
                .code(report.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(report.isEmpty() ? "Data tidak ditemukan" : "Data ditemukan")
                .data(PageResponse.<ReportRequestDto>builder()
                        .size(report.getSize())
                        .totalElements(report.getTotalElements())
                        .totalPages(report.getTotalPages())
                        .numberOfElements(report.getNumberOfElements())
                        .pageOf(report.getPageable().getPageNumber())
                        .page(report.getPageable().getPageSize())
                        .content(mappingContentPage(report, ReportRequestDto::reportRequestDto))
                        .build())
                .build();
    }

    @PostMapping("/date")
    Page<Report> getReportByDate(@RequestParam String date,
                                 @RequestBody RequestPagination pagination) {
        var contents = reportService.findReportByDate(date, pagination);
        return contents;
    }

    @PostMapping
    Report persistNew(RequestAddReport request) {
        Report newContent = reportService.persistNew(request);
        return newContent;
    }
}
