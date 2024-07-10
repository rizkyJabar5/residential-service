package id.application.feature.model.repositories;

import id.application.feature.model.entity.AppUser;
import id.application.feature.model.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<UserInfo, String> {
    Optional<UserInfo> findByKkIdAndPhoneNumber(String kkId, String phoneNumber);

    @Query("""
            select u from UserInfo u
            where lower(u.appUser.name) like lower(concat('%',?1, '%'))
            and u.kkId = ?2
            """)
    Optional<UserInfo> findUserInfoByNameAndKkId(String fullName, String kkId);

    @Query("select (count(u) > 0) from UserInfo u where u.kkId = ?1 and u.phoneNumber = ?2")
    boolean existsByKkId(String kkId, String phoneNumber);

    Optional<UserInfo> findByAppUserId(String appUserId);

    UserInfo findByAppUser(AppUser appUser);
}