package id.application.feature.model.entity;

import id.application.util.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "finance")
public class Finance extends BaseEntity {

    private String citizenId;

    private String userInfoId;

    private String imageUrl;
}
