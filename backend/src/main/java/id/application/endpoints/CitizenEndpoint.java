package id.application.endpoints;

import id.application.feature.dto.request.RequestAddFamilyMember;
import id.application.feature.dto.request.RequestCitizenAdd;
import id.application.feature.dto.request.RequestCitizenUpdate;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.model.entity.Citizen;
import id.application.feature.service.CitizenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/citizens")
@Validated
public class CitizenEndpoint {
    private final CitizenService citizenService;

    @GetMapping
    public Page<Citizen> getAllCitizen(Integer size, Integer pageOf) {
        return citizenService.findAllCitizen(size, pageOf);
    }

    @GetMapping("/citizen")
    public List<Citizen> searchCitizenByName(@RequestParam("name") String name) {
        return citizenService.findCitizenByNameLike(name);
    }

    @GetMapping("/{id}")
    public Citizen getCitizenById(@PathVariable String id) {
        return citizenService.findCitizenById(id);
    }

    @PostMapping
    public Citizen createNew(@Valid @RequestBody RequestCitizenAdd request) {
        return citizenService.persistNew(request);
    }

    @PostMapping("/families")
    public BaseResponse<Void> addFamilyMember(@RequestBody RequestAddFamilyMember request) {
        return citizenService.addFamilyMembers(request);
    }

    @PutMapping
    public Citizen updateCitizen(@RequestBody RequestCitizenUpdate request) {
        return citizenService.updateById(request);
    }
}
