package id.application.endpoints;

import id.application.feature.dto.request.*;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.CitizenDto;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.model.entity.Citizen;
import id.application.feature.service.CitizenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static id.application.util.FilterableUtil.mappingContentPage;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_EMPTY;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/citizens")
@Validated
public class CitizenEndpoint {
    private final CitizenService citizenService;

    @GetMapping
    public BaseResponse<PageResponse<CitizenDto>> getAllCitizen(@RequestParam(defaultValue = "0") Integer page,
                                                                @RequestParam(defaultValue = "50") Integer limitContent) {
        var citizens = citizenService.findAllCitizen(RequestPagination.builder()
                .page(page)
                .limitContent(limitContent)
                .build());
        return BaseResponse.<PageResponse<CitizenDto>>builder()
                .code(citizens.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(citizens.isEmpty() ? "Data warga tidak ditemukan" : "Data warga ditemukan")
                .data(PageResponse.<CitizenDto>builder()
                        .size(citizens.getSize())
                        .totalElements(citizens.getTotalElements())
                        .totalPages(citizens.getTotalPages())
                        .numberOfElements(citizens.getNumberOfElements())
                        .pageOf(citizens.getPageable().getPageNumber())
                        .page(citizens.getPageable().getPageSize())
                        .content(mappingContentPage(citizens, CitizenDto::entityToDto))
                        .build())
                .build();
    }

    @GetMapping("/citizen")
    public BaseResponse<List<CitizenDto>> searchCitizenByName(@RequestParam("name") String name) {
        List<Citizen> citizenFilters = citizenService.findCitizenByNameLike(name);
        return BaseResponse.<List<CitizenDto>>builder()
                .code(citizenFilters.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(citizenFilters.isEmpty() ? "Data warga tidak ditemukan" : "Data warga ditemukan")
                .data(citizenFilters.stream().map(CitizenDto::entityToDto).toList())
                .build();
    }

    @GetMapping("/{id}")
    public BaseResponse<CitizenDto> getCitizenById(@PathVariable String id) {
        Citizen citizen = citizenService.findCitizenById(id);
        return BaseResponse.<CitizenDto>builder()
                .code(CODE_CONTENT_FOUND)
                .message("Data warga ditemukan")
                .data(CitizenDto.entityToDto(citizen))
                .build();
    }

    @PostMapping
    public BaseResponse<CitizenDto> createNew(@Valid @RequestBody CitizenInfoRequest request) {
        Citizen citizen = citizenService.persistNew(request);
        return BaseResponse.<CitizenDto>builder()
                .code("200")
                .message("Berhasil manambahkan data !")
                .data(CitizenDto.entityToDto(citizen))
                .build();
    }

    @PostMapping("/families")
    public BaseResponse<CitizenDto> addFamilyMember(@RequestBody CitizenAddFamilyRequest request) {
        Citizen citizen = citizenService.addFamilyMembers(request);
        return BaseResponse.<CitizenDto>builder()
                .code("200")
                .message("Berhasil manambahkan data !")
                .data(CitizenDto.entityToDto(citizen))
                .build();
    }

    @GetMapping("/{id}/families")
    public BaseResponse<PageResponse<CitizenDto>> getFamilies(@PathVariable(name = "id") String id,
                                                              @RequestParam(defaultValue = "0") Integer page,
                                                              @RequestParam(defaultValue = "50") Integer limitContent) {
        var result = citizenService.findFamilyMembers(id, RequestPagination.builder()
                .page(page)
                .limitContent(limitContent)
                .build());
        return BaseResponse.<PageResponse<CitizenDto>>builder()
                .code(result.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .data(PageResponse.<CitizenDto>builder()
                        .size(result.getSize())
                        .totalElements(result.getTotalElements())
                        .totalPages(result.getTotalPages())
                        .numberOfElements(result.getNumberOfElements())
                        .pageOf(result.getPageable().getPageNumber())
                        .page(result.getPageable().getPageSize())
                        .content(mappingContentPage(result, CitizenDto::entityToDto))
                        .build())
                .build();
    }

    @PutMapping
    public BaseResponse<CitizenDto> updateCitizen(@RequestBody RequestCitizenUpdate request) {
        var citizen = citizenService.updateById(request);
        return BaseResponse.<CitizenDto>builder()
                .code(CODE_CONTENT_FOUND)
                .message("Data berhasil diupdate")
                .data(CitizenDto.entityToDto(citizen))
                .build();
    }
}
