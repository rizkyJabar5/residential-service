package id.application.feature.service;

import id.application.feature.dto.request.RequestAddFamilyMember;
import id.application.feature.dto.request.CitizenInfoRequest;
import id.application.feature.dto.request.RequestCitizenUpdate;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.model.entity.Citizen;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CitizenService {
    Page<Citizen> findAllCitizen(RequestPagination request);

    Citizen findCitizenById(String id);

    List<Citizen> findCitizenByNameLike(String name);

    @Transactional
    Citizen persistNew(CitizenInfoRequest request);

    @Transactional
    BaseResponse<Void> addFamilyMembers(RequestAddFamilyMember request);

    @Transactional
    Citizen updateById(RequestCitizenUpdate request);
}
