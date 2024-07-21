package id.application.feature.service;

import id.application.feature.dto.request.HomeInformationRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.HomeInformation;
import org.springframework.data.domain.Page;

public interface HomeInformationService {
    Page<HomeInformation> findAll(RequestPagination pageRequest);

    HomeInformation findById(String id);

    HomeInformation persistNew(HomeInformationRequest request);
}
