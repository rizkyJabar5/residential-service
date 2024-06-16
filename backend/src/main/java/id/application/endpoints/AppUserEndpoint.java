package id.application.endpoints;

import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.AppUserDto;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static id.application.util.FilterableUtil.mappingContentPage;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_EMPTY;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class AppUserEndpoint {
    private final AppUserService userService;

    @GetMapping
    public BaseResponse<PageResponse<AppUserDto>> getUsers(RequestPagination request) {
        var pageUsers = userService.findAll(request);

        return BaseResponse.<PageResponse<AppUserDto>>builder()
                .code(pageUsers.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(pageUsers.isEmpty() ? "Data user tidak ditemukan" : "Data user ditemukan")
                .data(PageResponse.<AppUserDto>builder()
                        .size(pageUsers.getSize())
                        .totalElements(pageUsers.getTotalElements())
                        .totalPages(pageUsers.getTotalPages())
                        .numberOfElements(pageUsers.getNumberOfElements())
                        .pageOf(pageUsers.getPageable().getPageNumber())
                        .page(pageUsers.getPageable().getPageSize())
                        .content(mappingContentPage(pageUsers, AppUserDto::entityToDto))
                        .build())
                .build();
    }
}
