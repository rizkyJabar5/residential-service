package id.application.feature.service.impl;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.AppUser;
import id.application.feature.model.repositories.AppUserRepository;
import id.application.feature.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import static id.application.util.FilterableUtil.pageable;

@RequiredArgsConstructor
@Service
public class AppUserServiceImpl implements AppUserService {
    private final AppUserRepository userRepository;

    @Override
    public Page<AppUser> findAll(RequestPagination request) {
        var pageable = pageable(request.page(), request.limitContent(), request.sort());
        return userRepository.findAll(pageable);
    }
}
