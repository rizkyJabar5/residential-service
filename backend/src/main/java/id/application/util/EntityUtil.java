package id.application.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EntityUtil {

    public static <T extends BaseEntity> void persistUtil(T entity, String userLoggedIn) {
        var dateNow = new Date(System.currentTimeMillis());
        entity.setCreatedBy(userLoggedIn);
        entity.setCreatedTime(dateNow);
        entity.setUpdatedBy(userLoggedIn);
        entity.setUpdatedTime(dateNow);
    }
}
