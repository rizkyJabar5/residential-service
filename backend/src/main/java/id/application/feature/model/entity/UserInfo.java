package id.application.feature.model.entity;

import id.application.util.enums.StatusRegistered;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserInfo implements Serializable {
    @Id
    private String id;

    @OneToOne(mappedBy = "userInfo", optional = false)
    @MapsId
    private AppUser appUser;

    @Column(length = 14)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusRegistered statusRegistered = StatusRegistered.NOT_REGISTERED;

    @Column(length = 20, nullable = false)
    private String kkId;

    private String citizenId;
}
