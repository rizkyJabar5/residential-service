package id.application.feature.model.entity;

import id.application.util.BaseEntity;
import id.application.util.enums.OwnershipStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table
public class HomeInformation extends BaseEntity {
    private String unit;
    private String owner;

    @Enumerated(EnumType.STRING)
    private OwnershipStatus ownershipStatus;

    @Column(columnDefinition = "Text")
    private String homeCondition;

    @Column(length = 14)
    private String phoneNumber;
}
