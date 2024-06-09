package id.application.feature.model.repositories;

import id.application.feature.model.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, String>, JpaSpecificationExecutor<AppUser> {
    @Query("SELECT a FROM AppUser a WHERE a.email = ?1")
    Optional<AppUser> findUserByUsername(String username);

    @Query("""
    SELECT
      (COUNT(a) > 0)
    FROM
      AppUser a
    WHERE
      a.email = ?1
    """)
    boolean existsUsername(String email);
}