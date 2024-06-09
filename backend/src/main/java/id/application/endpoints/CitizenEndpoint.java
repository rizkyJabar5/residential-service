package id.application.endpoints;

import dev.hilla.Endpoint;
import id.application.feature.dto.request.RequestAddFamilyMember;
import id.application.feature.dto.request.RequestCitizenAdd;
import id.application.feature.dto.request.RequestCitizenUpdate;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.model.entity.Citizen;
import id.application.feature.service.CitizenService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Endpoint
@RolesAllowed({"ADMIN"})
@RequiredArgsConstructor
public class CitizenEndpoint {
    private final CitizenService citizenService;

    public Page<Citizen> getAllCitizen(Integer size, Integer pageOf) {
        return citizenService.findAllCitizen(size, pageOf);
    }

    public List<Citizen> searchCitizenByName(String name) {
        return citizenService.findCitizenByNameLike(name);
    }

    public Citizen getCitizenById(String id) {
        return citizenService.findCitizenById(id);
    }

    public Citizen createNew(RequestCitizenAdd request) {
        return citizenService.persistNew(request);
    }

    public BaseResponse<Void> addFamilyMember(RequestAddFamilyMember request) {
        return citizenService.addFamilyMembers(request);
    }

    public Citizen updateCitizen(RequestCitizenUpdate request) {
        return citizenService.updateById(request);
    }
}
