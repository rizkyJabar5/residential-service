package id.application.feature.model.repositories;

import id.application.feature.model.entity.LetterRequest;
import id.application.util.enums.StatusLetter;
import id.application.util.enums.TypeLetter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface LetterRequestRepository extends JpaRepository<LetterRequest, String> {
    Optional<LetterRequest> findByLetterId(String letterId);

    @Query("""
            select l
            from LetterRequest l
            where l.status = :status
            """)
    Page<LetterRequest> findByLetterStatus(StatusLetter status, Pageable pageable);

    @Query("""
            select l
            from LetterRequest l
            where l.citizenId = ?1
            """)
    Page<LetterRequest> findLetterRequestByCitizenId(String citizenId, Pageable pageable);

    @Query("""
            select l
            from LetterRequest l
            where l.nik = ?1
            and l.status = 0
            """)
    Optional<LetterRequest> findLetterRejected(String nik);

    @Query("""
            select (count(l) > 0)
            from LetterRequest l
            where l.nik = ?1
            and l.type = ?2
            and l.status = 1
            """)
    boolean existByNikAndType(String nik, TypeLetter type);

    @Query("select (count(l)) from LetterRequest l where l.status = 7")
    Integer countLetterUnapproved();
}