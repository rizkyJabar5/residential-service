package id.application.endpoints;

import id.application.feature.dto.request.LetterAddRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.request.UpdateLetterStatusRequest;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.LetterRequestDto;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.model.entity.LetterRequest;
import id.application.feature.service.LetterService;
import id.application.util.enums.StatusLetter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

import static id.application.util.FilterableUtil.mappingContentPage;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_EMPTY;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/letters")
@Validated
public class LetterEndpoint {
    public static final String DATA_TIDAK_DITEMUKAN = "Data surat pengajuan tidak ditemukan";
    public static final String DATA_FOUND = "Data surat pengajuan ditemukan";
    private final LetterService service;

    @GetMapping
    public BaseResponse<PageResponse<LetterRequestDto>> getAllLetters(@RequestParam(defaultValue = "0") Integer page,
                                                                      @RequestParam(defaultValue = "10") Integer limitContent) {
        var letterRequest = service.findAll(RequestPagination.builder()
                .page(page)
                .limitContent(limitContent)
                .build()
        );

        return BaseResponse.<PageResponse<LetterRequestDto>>builder()
                .code(letterRequest.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(letterRequest.isEmpty() ? DATA_TIDAK_DITEMUKAN : "Data ditemukan")
                .data(PageResponse.<LetterRequestDto>builder()
                        .size(letterRequest.getSize())
                        .totalElements(letterRequest.getTotalElements())
                        .totalPages(letterRequest.getTotalPages())
                        .numberOfElements(letterRequest.getNumberOfElements())
                        .pageOf(letterRequest.getPageable().getPageNumber())
                        .page(letterRequest.getPageable().getPageSize())
                        .content(mappingContentPage(letterRequest, LetterRequestDto::letterRequestDto))
                        .build())
                .build();
    }

    @GetMapping("/status")
    public BaseResponse<PageResponse<LetterRequestDto>> getLetterByStatus(@RequestParam int status) {
        var statusLetter = StatusLetter.valueOf(status);
        Page<LetterRequest> contents = service.findLetterByStatus(statusLetter);
        return BaseResponse.<PageResponse<LetterRequestDto>>builder()
                .code(contents.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(contents.isEmpty() ? DATA_TIDAK_DITEMUKAN : DATA_FOUND)
                .data(PageResponse.<LetterRequestDto>builder()
                        .size(contents.getSize())
                        .totalElements(contents.getTotalElements())
                        .totalPages(contents.getTotalPages())
                        .numberOfElements(contents.getNumberOfElements())
                        .pageOf(contents.getPageable().getPageNumber())
                        .page(contents.getPageable().getPageSize())
                        .content(mappingContentPage(contents, LetterRequestDto::letterRequestDto))
                        .build())
                .build();
    }

    @GetMapping("/{id}")
    public BaseResponse<LetterRequestDto> getLetterById(@PathVariable String id) {
        var content = service.findById(id);
        return BaseResponse.<LetterRequestDto>builder()
                .code(CODE_CONTENT_FOUND)
                .message(Objects.isNull(content) ? DATA_TIDAK_DITEMUKAN : DATA_FOUND)
                .data(LetterRequestDto.letterRequestDto(content))
                .build();
    }

    @GetMapping("/letter/{nik}")
    public BaseResponse<LetterRequestDto> getLetterByLetterId(@PathVariable String nik) {
        var content = service.findByLetterId(nik);
        return BaseResponse.<LetterRequestDto>builder()
                .code(CODE_CONTENT_FOUND)
                .message(Objects.isNull(content) ? DATA_TIDAK_DITEMUKAN : DATA_FOUND)
                .data(LetterRequestDto.letterRequestDto(content))
                .build();
    }

    @PostMapping
    public BaseResponse<LetterRequestDto> createLetter(@RequestBody LetterAddRequest request) {
        var content = service.persistNew(request);
        return BaseResponse.<LetterRequestDto>builder()
                .code(CODE_CONTENT_FOUND)
                .message("Surat pengajuan berhasil dibuat")
                .data(LetterRequestDto.letterRequestDto(content))
                .build();
    }

    @PutMapping
    public void updateStatusLetter(@RequestBody UpdateLetterStatusRequest request) {
        service.updateStatusLetter(request);
    }

    @GetMapping(value = "/download/{id}")
    public ResponseEntity<byte[]> downloadSubmissionLetter(@PathVariable String id) {
        var response = service.downloadLetter(id);
        var header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + response.fileName());
        header.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
        header.add(HttpHeaders.PRAGMA, "no-cache");
        header.add(HttpHeaders.EXPIRES, "0");

        return ResponseEntity.ok()
                .headers(header)
//                .contentLength(response.contentLength())
                .contentType(MediaType.APPLICATION_PDF)
                .body(response.content());
    }
}
