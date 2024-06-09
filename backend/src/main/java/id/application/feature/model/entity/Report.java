package id.application.feature.model.entity;

import id.application.util.BaseEntity;
import id.application.util.enums.TypeFacility;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "report")
public class Report extends BaseEntity {
    private String name;
    private String citizenId;
    private String location;
    private String imageUrl;
    private TypeFacility typeFacility;
}