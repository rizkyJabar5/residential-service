package id.application.feature.dto.response;

import id.application.feature.model.entity.HomeInformation;
import lombok.Builder;

import java.io.Serializable;
import java.util.Date;

/**
 * DTO for {@link id.application.feature.model.entity.HomeInformation}
 */
@Builder
public record HomeInformationDto(
        String id,
        Date createdTime,
        String createdBy,
        Date updatedTime,
        String updatedBy,
        String unit,
        String owner,
        String ownershipStatus,
        String homeCondition,
        String phoneNumber) implements Serializable {

    public static HomeInformationDto homeInformationDto(HomeInformation entity){
        return HomeInformationDto.builder()
                .id(entity.getId())
                .createdTime(entity.getCreatedTime())
                .createdBy(entity.getCreatedBy())
                .updatedTime(entity.getUpdatedTime())
                .updatedBy(entity.getUpdatedBy())
                .unit(entity.getUnit())
                .owner(entity.getOwner())
                .ownershipStatus(entity.getOwnershipStatus().getStatus())
                .homeCondition(entity.getHomeCondition())
                .phoneNumber(entity.getPhoneNumber())
                .build();
    }
}