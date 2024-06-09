package id.application.endpoints;

import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.AppUserDto;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AppUserEndpoint {
    private final AppUserService userService;

    @GetMapping("/users")
    public PageResponse<AppUserDto> getUsers(RequestPagination request) {
        var pageUsers = userService.findAll(request);

        return PageResponse.<AppUserDto>builder()
                .size(pageUsers.getSize())
                .totalElements(pageUsers.getTotalElements())
                .totalPages(pageUsers.getTotalPages())
                .numberOfElements(pageUsers.getNumberOfElements())
                .content(pageUsers.getContent().stream()
                        .map(appUser -> {
                            var userInfo = appUser.getUserInfo();

                            return AppUserDto.builder()
                                    .name(appUser.getName())
                                    .createdTime(appUser.getCreatedTime())
                                    .email(appUser.getUsername())
                                    .role(appUser.getRole())
                                    .userInfo(userInfo != null ? AppUserDto.UserInfoDto.builder()
                                            .phoneNumber(userInfo.getPhoneNumber())
                                            .statusRegistered(userInfo.getStatusRegistered())
                                            .citizenId(userInfo.getCitizenId())
                                            .build() : null)
                                    .build();
                        })
                        .toList())
                .pageOf(pageUsers.getPageable().getPageNumber())
                .page(pageUsers.getPageable().getPageSize())
                .build();
    }
}
