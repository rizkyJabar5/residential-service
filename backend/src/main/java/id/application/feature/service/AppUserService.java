package id.application.feature.service;

import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.AppUser;
import org.springframework.data.domain.Page;

public interface AppUserService {
    Page<AppUser> findAll(RequestPagination request);
}
