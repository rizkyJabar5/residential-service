package id.application.feature.model.repositories;

import id.application.feature.model.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, String> {
    @Query("""
            select n
            from News n
            where upper(n.title) = upper(?1)
            and n.eventDate = ?2
            """)
    Optional<News> findByTitle(String title, LocalDate publishedAt);
}