package id.application.feature.service.impl;

import com.cloudinary.utils.ObjectUtils;
import id.application.config.CloudinaryConfig;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.AppUserDto;
import id.application.feature.dto.response.CitizenDto;
import id.application.feature.dto.response.ResponseFinanceDTO;
import id.application.feature.model.entity.AppUser;
import id.application.feature.model.entity.Citizen;
import id.application.feature.model.entity.Finance;
import id.application.feature.model.entity.UserInfo;
import id.application.feature.model.repositories.AppUserRepository;
import id.application.feature.model.repositories.CitizenRepository;
import id.application.feature.model.repositories.FinanceRepository;
import id.application.feature.model.repositories.UserInfoRepository;
import id.application.feature.service.FinanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import static id.application.security.SecurityUtils.getUserLoggedIn;
import static id.application.util.EntityUtil.persistUtil;
import static id.application.util.FilterableUtil.pageable;

@RequiredArgsConstructor
@Service
@Slf4j
public class FinanceServiceImpl implements FinanceService {

    private final FinanceRepository financeRepository;
    private final CloudinaryConfig cloudinaryConfig;
    private final CitizenRepository citizenRepository;
    private final UserInfoRepository userInfoRepository;
    private final AppUserRepository appUserRepository;

    @Override
    public Page<ResponseFinanceDTO> getAllFinances(RequestPagination requestPagination) {
        var sortByCreatedTime = Sort.by(Sort.Order.desc("createdTime"));
        var pageable = pageable(requestPagination.page(), requestPagination.limitContent(), sortByCreatedTime);
        Page<Finance> payments = financeRepository.findAll(pageable);
        return payments.map(this::converToPaymentResponseDTO);
    }

    @Override
    public Finance persistNewFinance(MultipartFile image) {
        var authenticationUser = getUserLoggedIn();

        Citizen citizen = citizenRepository.findById(authenticationUser.getUserInfo().getCitizenId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Citizen not found"));
        log.info("id citizen (CITIZEN) : {}", authenticationUser.getUserInfo().getCitizenId());
        UserInfo userInfo = userInfoRepository.findById(authenticationUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "UserInfo not found"));
        log.info("id user info : {}", authenticationUser.getId());
        Finance entity = new Finance();
        entity.setCitizenId(citizen.getId());
        entity.setUserInfoId(userInfo.getId());

        if (image != null && !image.isEmpty()) {
            String imageUrl = getUrlAndUploadImage(image);
            entity.setImageUrl(imageUrl);
        } else {
            entity.setImageUrl(null);
        }

        persistUtil(entity, authenticationUser.getName());
        return financeRepository.saveAndFlush(entity);
    }


    private String getUrlAndUploadImage(MultipartFile image) {
        return cloudinaryConfig.upload(image,
                        ObjectUtils.asMap(
                                "resourceType", "image",
                                "folder", "journal-backend/"))
                .get("url").toString();
    }

    private ResponseFinanceDTO converToPaymentResponseDTO(Finance finance) {
        Citizen citizen = citizenRepository.findById(finance.getCitizenId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Citizen not found"));

        AppUser appUser = appUserRepository.findById(finance.getUserInfoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        CitizenDto citizenDto = CitizenDto.entityToDto(citizen);
        AppUserDto appUserDto = AppUserDto.entityToDto(appUser);

        return ResponseFinanceDTO.builder()
                .id(finance.getId())
                .citizen(citizenDto)
                .appUserDto(appUserDto)
                .imageUrl(finance.getImageUrl())
                .tglPembayaran(finance.getCreatedTime())
                .build();
    }
}
