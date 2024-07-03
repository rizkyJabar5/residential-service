package id.application.endpoints;

import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.dto.response.ResponseFinanceDTO;
import id.application.feature.model.entity.Finance;
import id.application.feature.service.FinanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_EMPTY;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/finances")
@Validated
@Slf4j
public class FinanceEndpoint {

    private final FinanceService financeService;

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    Finance persistNew(
            @RequestPart("image") MultipartFile image
    ) {
        Finance addFinance = financeService.persistNewFinance(image);
        return addFinance;
    }

    @GetMapping
    public BaseResponse<PageResponse<ResponseFinanceDTO>> getAllFinances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limitContent) {

        var finances = financeService.getAllFinances(RequestPagination.builder()
                .page(page)
                .limitContent(limitContent)
                .build());

        return BaseResponse.<PageResponse<ResponseFinanceDTO>>builder()
                .code(finances.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(finances.isEmpty() ? "Data tidak ditemukan" : "Data ditemukan")
                .data(PageResponse.<ResponseFinanceDTO>builder()
                        .size(finances.getSize())
                        .totalElements(finances.getTotalElements())
                        .totalPages(finances.getTotalPages())
                        .numberOfElements(finances.getNumberOfElements())
                        .pageOf(finances.getPageable().getPageNumber())
                        .page(finances.getPageable().getPageSize())
                        .content(finances.getContent())
                        .build())
                .build();
    }

    @GetMapping("/citizen/{id}")
    public BaseResponse<PageResponse<ResponseFinanceDTO>> getFinancesByCitizenId(
            @PathVariable("id") String citizenId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limitContent) {

        var result = financeService.findFinancesByCitizenId(citizenId, RequestPagination.builder()
                .page(page)
                .limitContent(limitContent)
                .build());

        return BaseResponse.<PageResponse<ResponseFinanceDTO>>builder()
                .code(result.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(result.isEmpty() ? "Data pembayaran tidak ditemukan" : "Data ditemukan")
                .data(PageResponse.<ResponseFinanceDTO>builder()
                        .size(result.getSize())
                        .totalElements(result.getTotalElements())
                        .totalPages(result.getTotalPages())
                        .numberOfElements(result.getNumberOfElements())
                        .pageOf(result.getPageable().getPageNumber())
                        .page(result.getPageable().getPageSize())
                        .content(result.getContent())
                        .build())
                .build();
    }
}
