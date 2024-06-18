package id.application.feature.dto.response;

import id.application.feature.model.entity.AppUser;
import id.application.util.enums.ERole;
import id.application.util.enums.StatusRegistered;
import lombok.Builder;

import java.io.Serializable;
import java.util.Date;

/**
 * DTO for {@link id.application.feature.model.entity.AppUser}
 */
@Builder
public record AppUserDto(
        String id,
        Date createdTime,
        String createdBy,
        Date updatedTime,
        String updatedBy,
        String name,
        String email,
        UserInfoDto userInfo,
        String role) implements Serializable {
    /**
     * DTO for {@link id.application.feature.model.entity.UserInfo}
     */
    @Builder
    public record UserInfoDto(
            String citizenId,
            String kkId,
            String phoneNumber,
            StatusRegistered statusRegistered) implements Serializable {}

    public static AppUserDto entityToDto(AppUser appUser) {
        var userInfo = appUser.getUserInfo();

        return AppUserDto.builder()
                .id(appUser.getId())
                .name(appUser.getName())
                .createdTime(appUser.getCreatedTime())
                .createdBy(appUser.getCreatedBy())
                .updatedTime(appUser.getUpdatedTime())
                .updatedBy(appUser.getUpdatedBy())
                .email(appUser.getUsername())
                .role(appUser.getRole().getName())
                .userInfo(userInfo != null ? UserInfoDto.builder()
                        .kkId(userInfo.getKkId())
                        .citizenId(userInfo.getCitizenId())
                        .phoneNumber(userInfo.getPhoneNumber())
                        .statusRegistered(userInfo.getStatusRegistered())
                        .build() : null)
                .build();
    }
}