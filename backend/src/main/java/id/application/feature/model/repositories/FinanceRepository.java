package id.application.feature.model.repositories;

import id.application.feature.model.entity.Finance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FinanceRepository extends JpaRepository<Finance, String> {
    @Query("""
            SELECT f
            FROM finance f
            WHERE f.citizenId = ?1
            """)
    Page<Finance> findFinancesByCitizenId(String citizenId, Pageable pageable);
}
