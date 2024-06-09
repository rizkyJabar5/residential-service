package id.application.feature.model.repositories;

import id.application.feature.model.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CitizenRepository extends JpaRepository<Citizen, String> {

    Optional<Citizen> findByKkId(String kkId);

    @Query("select c from Citizen c where upper(c.fullName) like upper(?1)")
    List<Citizen> findCitizenByNameLike(String name);

    Optional<Citizen> findCitizenByFullName(String name);

    @Query("select (count(c)) from Citizen c where c.kkId =?1")
    Integer countFamilyMember(String kkId);

    Boolean existsByNik(String nik);
}