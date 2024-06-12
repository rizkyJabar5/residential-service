package id.application.feature.service.impl;

import id.application.exception.AppConflictException;
import id.application.exception.ResourceNotFoundException;
import id.application.feature.dto.request.RequestAddFamilyMember;
import id.application.feature.dto.request.CitizenInfoRequest;
import id.application.feature.dto.request.RequestCitizenUpdate;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.model.entity.Citizen;
import id.application.feature.model.repositories.CitizenRepository;
import id.application.feature.model.repositories.UserInfoRepository;
import id.application.feature.service.CitizenService;
import id.application.util.enums.StatusRegistered;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
    import java.util.ArrayList;
import java.util.List;

import static id.application.security.SecurityUtils.getUserLoggedIn;
import static id.application.util.ConverterDateTime.convertToDateDefaultPattern;
import static id.application.util.ConverterDateTime.convertToLocalDateDefaultPattern;
import static id.application.util.EntityUtil.persistUtil;
import static id.application.util.FilterableUtil.pageable;

@Service
@RequiredArgsConstructor
public class CitizenServiceImpl implements CitizenService {
    private final CitizenRepository citizenRepository;
    private final UserInfoRepository userInfoRepository;

    @Override
    public Page<Citizen> findAllCitizen(RequestPagination request) {
        var sortByCreatedTime = Sort.by(Sort.Order.asc("createdTime"));
        var pageable = pageable(request.page(), request.limitContent(), sortByCreatedTime);
        return citizenRepository.findAll(pageable);
    }

    @Override
    public Citizen findCitizenById(String id) {
        return citizenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Citizen with id %s not found", id)));
    }

    @Override
    public List<Citizen> findCitizenByNameLike(String name) {
        return citizenRepository.findCitizenByNameLike(name);
    }

    @Override
    public Citizen persistNew(CitizenInfoRequest request) {
        var userLoggedIn = getUserLoggedIn();
        var alreadyRegistered = this.isCitizenRegistered(request.nik());

        if (alreadyRegistered) {
            throw new AppConflictException("Data kamu telah terdaftar");
        }

        validateCitizenIsAlReadyRegistered(request.fullName(), request.nik());

        var entity  = this.buildCitizen(request);
        persistUtil(entity, userLoggedIn.getName());

        return citizenRepository.save(entity);
    }

    @Override
    public BaseResponse<Void> addFamilyMembers(RequestAddFamilyMember request) {
        var userLoggedIn = getUserLoggedIn();

        var existCitizen = citizenRepository.findCitizenByFullName(request.fullName())
                .orElseThrow();

        var addressSplit = existCitizen.getHomeAddress().split(" No. ");
        var block = addressSplit[0];
        var homeId = Integer.parseInt(addressSplit[1]);

        var familyMembers = new ArrayList<Citizen>();
        for (var familyMember : request.familyMembers()) {
            var family = this.buildCitizen(CitizenInfoRequest.builder()
                    .kkId(existCitizen.getKkId())
                    .fullName(familyMember.fullName())
                    .nik(familyMember.nik())
                    .gender(familyMember.gender())
                    .placeOfBirth(familyMember.placeOfBirth())
                    .dateOfBirth(familyMember.dateOfBirth())
                    .religion(familyMember.religion())
                    .latestEducation(familyMember.latestEducation())
                    .familyStatus(familyMember.familyStatus())
                    .jobType(familyMember.jobType())
                    .bloodType(familyMember.bloodType())
                    .marriageStatus(familyMember.marriageStatus())
                    .block(block)
                    .homeId(homeId)
                    .build());
            persistUtil(family, userLoggedIn.getName());
            familyMembers.add(family);
        }
        citizenRepository.saveAllAndFlush(familyMembers);

        return BaseResponse.<Void>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .message("Berhasil menambahkan anggota keluarga")
                .build();
    }

    @Override
    public Citizen updateById(RequestCitizenUpdate request) {
        var userLoggedIn = getUserLoggedIn();

        var existingCitizen = this.findCitizenById(request.name());
        if (request.name() != null) {
            existingCitizen.setFullName(request.name());
        }
        if (request.block() != null) {
            existingCitizen.setBlock(request.block());
        }
        if (request.homeId() != null) {
            existingCitizen.setHomeId(request.homeId());

        }
        if (request.familyNumber() != null) {
            existingCitizen.setFamilyNumber(request.familyNumber());
        }

        existingCitizen.setUpdatedBy(userLoggedIn.getName());
        existingCitizen.setUpdatedTime(convertToDateDefaultPattern(LocalDate.now().toString()));

        return citizenRepository.save(existingCitizen);
    }

    private Citizen buildCitizen(CitizenInfoRequest request) {
        var entity  = new Citizen();
        entity.setKkId(request.kkId());
        entity.setFullName(request.fullName());
        entity.setNik(request.nik());
        entity.setGender(request.gender());
        entity.setPlaceOfBirth(request.placeOfBirth());
        entity.setDateOfBirth(convertToLocalDateDefaultPattern(request.dateOfBirth()));
        entity.setReligion(request.religion());
        entity.setLatestEducation(request.latestEducation());
        entity.setFamilyStatus(request.familyStatus());
        entity.setJobType(request.jobType());
        entity.setBloodType(request.bloodType());
        entity.setMarriageStatus(request.marriageStatus());
        entity.setBlock(request.block());
        entity.setHomeId(request.homeId());

        return entity;
    }

    private boolean isCitizenRegistered(String nik) {
        return citizenRepository.existsByNik(nik);
    }

    private void validateCitizenIsAlReadyRegistered(String fullName, String kkId) {
        var optionalUserInfo = userInfoRepository.findUserInfoByNameAndKkId(fullName, kkId)
                .filter(user -> user.getStatusRegistered() == StatusRegistered.NOT_REGISTERED);

        if (optionalUserInfo.isEmpty()) {
            throw new AppConflictException("Silahkan registrasi terlebih dahulu.");
        }
    }
}
