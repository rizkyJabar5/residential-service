package id.application.util;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;

import java.io.Serializable;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@MappedSuperclass
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public abstract class BaseEntity implements Serializable {
    public static final String SYSTEM = "SYSTEM";

    @Id
    private String id;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdTime;

    @CreatedBy
    private String createdBy;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedTime;

    private String updatedBy;

    @Version
    private Integer version;

    @PrePersist
    void generateId() {
        this.id = UUID.randomUUID().toString();
        if (this.createdBy == null || this.updatedBy.isEmpty()) {
            this.createdBy = SYSTEM;
        }
    }

    @PreUpdate
    void updatedAt() {
        this.updatedTime = Date.from(Instant.now());
    }
}
