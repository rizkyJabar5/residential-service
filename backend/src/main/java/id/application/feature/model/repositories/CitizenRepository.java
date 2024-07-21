package id.application.feature.model.repositories;

import id.application.feature.model.entity.Citizen;
import id.application.util.enums.Gender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CitizenRepository extends JpaRepository<Citizen, String> {
    @Query("""
            select c
            from Citizen c
            where c.kkId = ?1
            """)
    Page<Citizen> findAllFamilies(String kkId, Pageable pageable);

    Optional<Citizen> findByKkId(String kkId);

    @Query("select c from Citizen c where upper(c.fullName) like upper(?1)")
    List<Citizen> findCitizenByNameLike(String name);

    Optional<Citizen> findCitizenByFullName(String name);

    @Query("select (count(c)) from Citizen c where c.kkId =?1")
    Integer countFamilyMember(String kkId);

    Boolean existsByNik(String nik);

    @Query("select (count(c)) from Citizen c")
    Integer countAllCitizen();

    @Query("""
            select (count(c)) from Citizen c
            where c.gender = ?1
            """)
    Integer clasificationGender(Gender gender);

    @Query("""
            select (count(c)) from Citizen c
            where year(current_date) - year(c.dateOfBirth) <= 5
            and (
                month(current_date) > month(c.dateOfBirth)
                or (
                    month(current_date) = month(c.dateOfBirth) AND day(current_date) >= day(c.dateOfBirth)
                )
            )
            """)
    Integer clasificationUnderAge();
}

/*
* SELECT e
FROM YourEntity e
WHERE year(current_date) - year(e.dateOfBirth) < 5 AND (
  month(current_date) > month(e.dateOfBirth) OR (
    month(current_date) = month(e.dateOfBirth) AND day(current_date) >= day(e.dateOfBirth)
  )
)

* */