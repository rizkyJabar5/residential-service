package id.application.feature.service.impl;

import id.application.exception.ResourceNotFoundException;
import id.application.feature.dto.request.HomeInformationRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.HomeInformation;
import id.application.feature.model.repositories.HomeInformationRepository;
import id.application.feature.service.HomeInformationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import static id.application.feature.service.impl.LetterServiceImpl.MSG_LETTER_NOT_FOUND;
import static id.application.util.FilterableUtil.pageable;

@Service
@Transactional
@RequiredArgsConstructor
public class HomeInformationServiceImpl implements HomeInformationService {
    private final HomeInformationRepository repository;

    @Override
    public Page<HomeInformation> findAll(RequestPagination pageRequest) {
        var sortByCreatedTime = Sort.by(Sort.Order.desc("createdTime"));
        var pageable = pageable(pageRequest.page(), pageRequest.limitContent(), sortByCreatedTime);

        return repository.findAll(pageable);
    }

    @Override
    public HomeInformation findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(MSG_LETTER_NOT_FOUND));
    }

    @Override
    public HomeInformation persistNew(HomeInformationRequest request) {
        var entity = new HomeInformation();
        entity.setUnit(request.unit());
        entity.setOwner(request.owner());
        entity.setOwnershipStatus(request.ownershipStatus());
        entity.setHomeCondition(request.homeCondition());
        entity.setPhoneNumber(request.phoneNumber());
        return repository.save(entity);
    }
}
