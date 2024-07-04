package id.application.feature.service.impl;

import id.application.exception.AppConflictException;
import id.application.exception.ResourceNotFoundException;
import id.application.feature.dto.request.CitizenAddFamilyRequest;
import id.application.feature.dto.request.CitizenInfoRequest;
import id.application.feature.dto.request.RequestCitizenUpdate;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.Citizen;
import id.application.feature.model.repositories.CitizenRepository;
import id.application.feature.model.repositories.UserInfoRepository;
import id.application.feature.service.CitizenService;
import id.application.util.enums.ERole;
import id.application.util.enums.StatusRegistered;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import static id.application.security.SecurityUtils.getUserLoggedIn;
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
        var userLoggedIn = getUserLoggedIn();
        var sortByCreatedTime = Sort.by(Sort.Order.desc("createdTime"));
        var pageable = pageable(request.page(), request.limitContent(), sortByCreatedTime);

        if (userLoggedIn.getRole().equals(ERole.CITIZEN)) {
            return citizenRepository.findAllFamilies(userLoggedIn.getUserInfo().getKkId(), pageable);
        }

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

    @Transactional
    @Override
    public Citizen persistNew(CitizenInfoRequest request) {
        var userLoggedIn = getUserLoggedIn();
        var alreadyRegistered = this.isCitizenRegistered(request.nik());

        if (alreadyRegistered) {
            throw new AppConflictException(String.format("Data %s telah terdaftar", request.fullName()));
        }

        var userInfo = userLoggedIn.getUserInfo();

        String userLoggedInKkId = userInfo != null ? userLoggedIn.getUserInfo().getKkId() : null;

        var entity = this.buildCitizen(request, userLoggedInKkId);
        persistUtil(entity, userLoggedIn.getName());
        var citizen = citizenRepository.save(entity);

        if (userInfo != null && userInfo.getStatusRegistered().equals(StatusRegistered.VERIFIED)) {
            userInfo.setCitizenId(entity.getId());
            userInfo.setStatusRegistered(StatusRegistered.REGISTERED);
            userInfoRepository.save(userInfo);
        }

        return citizen;
    }

    @Override
    public Citizen addFamilyMembers(CitizenAddFamilyRequest request) {
        var entity = this.buildAddFamily(request);
        return citizenRepository.save(entity);
    }

    private Citizen buildAddFamily(CitizenAddFamilyRequest request) {
        var userLoggedIn = getUserLoggedIn();

        var existCitizen = citizenRepository.findById(userLoggedIn.getUserInfo().getCitizenId())
                .orElseThrow(() -> new ResourceNotFoundException("Citizen with name not found"));

        var entity = new Citizen();
        entity.setKkId(existCitizen.getKkId());
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
        entity.setAddress(existCitizen.getAddress());

        persistUtil(entity, userLoggedIn.getName());

        return entity;
    }

    @Override
    public Citizen updateById(RequestCitizenUpdate request) {
        var userLoggedIn = getUserLoggedIn();

        var existingCitizen = this.findCitizenById(request.id());
        existingCitizen.setKkId(request.kkId());
        existingCitizen.setFullName(request.fullName());
        existingCitizen.setNik(request.nik());
        existingCitizen.setGender(request.gender());
        existingCitizen.setPlaceOfBirth(request.placeOfBirth());
        existingCitizen.setDateOfBirth(convertToLocalDateDefaultPattern(request.dateOfBirth()));
        existingCitizen.setReligion(request.religion());
        existingCitizen.setLatestEducation(request.latestEducation());
        existingCitizen.setFamilyStatus(request.familyStatus());
        existingCitizen.setJobType(request.jobType());
        existingCitizen.setBloodType(request.bloodType());
        existingCitizen.setMarriageStatus(request.marriageStatus());
        existingCitizen.setAddress(request.address());

        existingCitizen.setUpdatedBy(userLoggedIn.getName());
        existingCitizen.setUpdatedTime(new Date(System.currentTimeMillis()));

        return citizenRepository.save(existingCitizen);
    }

    private Citizen buildCitizen(CitizenInfoRequest request, String userLoggedInKkId) {
        var entity = new Citizen();

        if (userLoggedInKkId != null) {
            entity.setKkId(userLoggedInKkId);
        }else {
            entity.setKkId(request.kkId());
        }

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
        entity.setAddress(request.address());



        return entity;
    }

    private boolean isCitizenRegistered(String nik) {
        return citizenRepository.existsByNik(nik);
    }
}
