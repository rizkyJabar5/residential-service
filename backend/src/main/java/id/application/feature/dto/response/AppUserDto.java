package id.application.feature.dto.response;

import id.application.util.enums.ERole;
import id.application.util.enums.Gender;
import id.application.util.enums.LatestEducation;
import id.application.util.enums.Religion;
import id.application.util.enums.StatusRegistered;
import lombok.Builder;

import java.io.Serializable;
import java.time.ZonedDateTime;
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
        ERole role,
        boolean isAccountNonExpired,
        boolean isAccountNonLocked,
        boolean isCredentialsNonExpired,
        boolean isEnabled) implements Serializable {
    /**
     * DTO for {@link id.application.feature.model.entity.UserInfo}
     */
    @Builder
    public record UserInfoDto(
            String citizenId,
            Integer kkId,
            Integer nik,
            String phoneNumber,
            String placeOfBirth,
            ZonedDateTime dateOfBirth,
            StatusRegistered statusRegistered,
            Gender gender,
            Religion religion,
            LatestEducation latestEducation,
            Integer homeId) implements Serializable {}
}