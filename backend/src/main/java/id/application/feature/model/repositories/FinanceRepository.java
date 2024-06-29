package id.application.feature.model.repositories;

import id.application.feature.model.entity.Finance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinanceRepository extends JpaRepository<Finance, String> {

}
