package id.application.feature.model.repositories;

import id.application.feature.model.entity.HomeInformation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeInformationRepository extends JpaRepository<HomeInformation, String> {
}