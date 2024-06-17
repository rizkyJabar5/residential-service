package id.application.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EntityUtil {

    public static <T extends BaseEntity> void persistUtil(T entity, String userLoggedIn) {
        var dateNow = Date.from(Instant.now());
        entity.setCreatedBy(userLoggedIn);
        entity.setCreatedTime(dateNow);
        entity.setUpdatedBy(userLoggedIn);
        entity.setUpdatedTime(dateNow);
        System.out.println(dateNow);
    }
}
