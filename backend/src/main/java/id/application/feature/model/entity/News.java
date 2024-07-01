package id.application.feature.model.entity;

import id.application.util.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "news")
public class News extends BaseEntity {
    private String title;

    private String recipient;

    private String event;

    private String location;

    private LocalDate eventDate;

    private String startTime;

    private String endTime;

    @Column(columnDefinition = "Text")
    private String content;
}
