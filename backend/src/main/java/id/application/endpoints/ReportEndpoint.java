package id.application.endpoints;

import id.application.feature.dto.response.ReportResponseDto;
import id.application.feature.dto.request.RequestAddReport;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.model.entity.Report;
import id.application.feature.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static id.application.util.FilterableUtil.mappingContentPage;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_EMPTY;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/reports")
@Validated
@Slf4j
public class ReportEndpoint {
    private final ReportService reportService;


    @GetMapping
    public BaseResponse<PageResponse<ReportResponseDto>> getAllReports(@RequestParam(defaultValue = "0") Integer page,
                                                                       @RequestParam(defaultValue = "10") Integer limitedContent) {
        var report = reportService.findAll(RequestPagination.builder()
                .page(page)
                .limitContent(limitedContent)
                .build()
        );

        return BaseResponse.<PageResponse<ReportResponseDto>>builder()
                .code(report.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(report.isEmpty() ? "Data tidak ditemukan" : "Data ditemukan")
                .data(PageResponse.<ReportResponseDto>builder()
                        .size(report.getSize())
                        .totalElements(report.getTotalElements())
                        .totalPages(report.getTotalPages())
                        .numberOfElements(report.getNumberOfElements())
                        .pageOf(report.getPageable().getPageNumber())
                        .page(report.getPageable().getPageSize())
                        .content(mappingContentPage(report, ReportResponseDto::reportRequestDto))
                        .build())
                .build();
    }

    @PostMapping("/date")
    Page<Report> getReportByDate(@RequestParam String date,
                                 @RequestBody RequestPagination pagination) {
        var contents = reportService.findReportByDate(date, pagination);
        return contents;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    Report persistNew(
            @RequestPart("request") RequestAddReport request,
            @RequestPart("image") MultipartFile image
    ) {
        log.info("ini image di endpoint : {}", image.getOriginalFilename());

        Report newContent = reportService.persistNew(request, image);

        return newContent;
    }
}
