package id.application.feature.model.repositories;

import id.application.feature.model.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;

public interface ReportRepository extends JpaRepository<Report, String> {
    @Query("""
        select r from Report r
        where cast(r.createdTime as date) = cast(?1 as date)
        """)
    Page<Report> findReportByDate(Date date, Pageable pageable);
}