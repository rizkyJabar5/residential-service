package id.application.endpoints;

import id.application.feature.dto.request.HomeInformationRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.HomeInformationDto;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.service.HomeInformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import static id.application.util.FilterableUtil.mappingContentPage;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_EMPTY;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_FOUND;

@RestController
@RequestMapping("api/v1/house-collections")
@RequiredArgsConstructor
public class HomeInformationEndpoint {
    private final HomeInformationService service;

    @GetMapping
    public BaseResponse<PageResponse<HomeInformationDto>> getAll(@RequestParam(defaultValue = "0") Integer page,
                                                                 @RequestParam(defaultValue = "10") Integer limitContent) {
        var result = service.findAll(RequestPagination.builder()
                .page(page)
                .limitContent(limitContent)
                .build());

        return BaseResponse.<PageResponse<HomeInformationDto>>builder()
                .code(result.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(result.isEmpty() ? "Data tidak ditemukan" : "Data ditemukan")
                .data(PageResponse.<HomeInformationDto>builder()
                        .size(result.getSize())
                        .totalElements(result.getTotalElements())
                        .totalPages(result.getTotalPages())
                        .numberOfElements(result.getNumberOfElements())
                        .pageOf(result.getPageable().getPageNumber())
                        .page(result.getPageable().getPageSize())
                        .content(mappingContentPage(result, HomeInformationDto::homeInformationDto))
                        .build())
                .build();
    }

    @GetMapping("/{id}")
    public BaseResponse<HomeInformationDto> getLetterById(@PathVariable String id) {
        var content = service.findById(id);
        return BaseResponse.<HomeInformationDto>builder()
                .code(CODE_CONTENT_FOUND)
                .message(Objects.isNull(content) ? "Data tidak ditemukan" : "Data ditemukan")
                .data(HomeInformationDto.homeInformationDto(content))
                .build();
    }

    @PostMapping
    public BaseResponse<HomeInformationDto> createLetter(@RequestBody HomeInformationRequest request) {
        var content = service.persistNew(request);
        return BaseResponse.<HomeInformationDto>builder()
                .code(CODE_CONTENT_FOUND)
                .message("Pendataan rumah warga berhasil dibuat")
                .data(HomeInformationDto.homeInformationDto(content))
                .build();
    }
}
