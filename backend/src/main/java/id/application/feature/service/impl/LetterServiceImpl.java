package id.application.feature.service.impl;

import id.application.config.pdf.TemplateConfig;
import id.application.exception.AppConflictException;
import id.application.exception.AppRuntimeException;
import id.application.exception.ResourceNotFoundException;
import id.application.feature.dto.request.LetterAddRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.request.TemplateRequest;
import id.application.feature.dto.request.UpdateLetterStatusRequest;
import id.application.feature.dto.response.DownloadResponse;
import id.application.feature.model.entity.Citizen;
import id.application.feature.model.entity.LetterRequest;
import id.application.feature.model.repositories.CitizenRepository;
import id.application.feature.model.repositories.LetterRequestRepository;
import id.application.feature.service.LetterService;
 import id.application.util.enums.ERole;
import id.application.util.enums.StatusLetter;
import id.application.util.enums.TypeLetter;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static id.application.config.pdf.PdfConfig.writePdfFile;
import static id.application.security.SecurityUtils.getUserLoggedIn;
import static id.application.util.ConverterDateTime.DATE_FORMAT;
import static id.application.util.ConverterDateTime.MONTH_PUBLISH_FORMAT;
import static id.application.util.ConverterDateTime.convertToLocalDateDefaultPattern;
import static id.application.util.ConverterDateTime.localDateToLocale;
import static id.application.util.ConverterDateTime.localDateToString;
import static id.application.util.EntityUtil.persistUtil;
import static id.application.util.FilterableUtil.pageable;

@RequiredArgsConstructor
@Service
public class LetterServiceImpl implements LetterService {
    public static final String MSG_LETTER_NOT_FOUND = "Surat pengajuan tidak ditemukan";
    public static final String OR = " atau ";
    public static final String PATH = "/";
    private final LetterRequestRepository repository;
    private final TemplateConfig templateConfig;
    private final CitizenRepository citizenRepository;

    @Override
    public Page<LetterRequest> findAll(RequestPagination request) {
        var userLoggedIn = getUserLoggedIn();

        var sortByCreatedTime = Sort.by(Sort.Order.desc("createdTime"));
        var pageable = pageable(request.page(), request.limitContent(), sortByCreatedTime);

        if (userLoggedIn.getRole().equals(ERole.CITIZEN)) {
            return repository.findLetterRequestByCitizenId(userLoggedIn.getUserInfo().getCitizenId(), pageable);
        }

        return repository.findAll(pageable);
    }

    @Override
    public Page<LetterRequest> findLetterByStatus(StatusLetter status) {
        getUserLoggedIn();
        var pageable = pageable(null, null, null);
        return repository.findByLetterStatus(status, pageable);
    }

    @Override
    public LetterRequest findById(String id) {
        getUserLoggedIn();
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(MSG_LETTER_NOT_FOUND));
    }

    @Override
    public LetterRequest findByLetterId(String nik) {
        getUserLoggedIn();
        return repository.findByLetterId(nik)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Surat pengajuan dengan NIK:%s tidak ditemukan", nik)));
    }

    @Override
    public LetterRequest persistNew(LetterAddRequest request) {
        var authenticatedUser = getUserLoggedIn();
        var userLoggedIn = authenticatedUser.getName();

        var typeLetters = new ArrayList<TypeLetter>();
        Citizen citizen = null;
        if (authenticatedUser.getRole() == ERole.CITIZEN) {
            var userInfoCitizen = authenticatedUser.getUserInfo().getCitizenId();
            citizen = citizenRepository.findById(userInfoCitizen)
                    .orElseThrow(() -> new ResourceNotFoundException("Citizen not found"));

            var nik = citizen.getNik();
            request.types().forEach(type -> {
                var typeLetter = TypeLetter.valueOf(type);
                typeLetters.add(typeLetter);
            });
            this.duplicateLetterRequest(nik, typeLetters);
        }

        var entity = repository.findLetterRejected(citizen != null ? citizen.getNik() : request.nik())
                .orElse(new LetterRequest());

        entity.generateLetterId();

        if (authenticatedUser.getRole() == ERole.CITIZEN) {
            entity.setCitizenId(citizen.getId());
            entity.setFullName(citizen.getFullName());
            entity.setPlaceBirth(citizen.getPlaceOfBirth());
            entity.setDateOfBirth((citizen.getDateOfBirth()));
            entity.setGender(citizen.getGender());
            entity.setNationality(request.nationality());
            entity.setReligion(citizen.getReligion());
            entity.setNik(citizen.getNik());
            entity.setMarriageStatus(citizen.getMarriageStatus());
            entity.setJobType(citizen.getJobType());
            entity.setAddress(citizen.getAddress());
        }else {
            entity.setFullName(request.fullName());
            entity.setPlaceBirth(request.pob());
            entity.setDateOfBirth(convertToLocalDateDefaultPattern(request.dob()));
            entity.setGender(request.gender());
            entity.setNationality(request.nationality());
            entity.setReligion(request.religion());
            entity.setNik(request.nik());
            entity.setMarriageStatus(request.marriageStatus());
            entity.setJobType(request.jobType());
            entity.setAddress(request.address());
        }

        entity.setTypes(typeLetters);
        entity.setStatus(StatusLetter.WAITING);
        persistUtil(entity, userLoggedIn);

        return repository.saveAndFlush(entity);
    }

    @Override
    public void updateStatusLetter(UpdateLetterStatusRequest request) {
        var authenticatedUser = getUserLoggedIn();
        var existLetter = repository.findById(request.letterId())
                .orElseThrow(() -> new ResourceNotFoundException(MSG_LETTER_NOT_FOUND));

        var statusLetter = StatusLetter.valueOf(request.status());
        existLetter.setStatus(statusLetter);
        existLetter.setUpdatedBy(authenticatedUser.getName());
        existLetter.setUpdatedTime(new Date(System.currentTimeMillis()));

        repository.save(existLetter);
    }

    @Override
    public DownloadResponse downloadLetter(String id) {
        var existSubmission = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(MSG_LETTER_NOT_FOUND));

        var types = existSubmission.getTypes();
        var letterType = getLetterType(types.get(0).getType());

        var dateNow = LocalDate.now() ;
        var templateHtml = templateConfig.ruEnrichProcessor(TemplateRequest.builder()
                .fullName(existSubmission.getFullName())
                .pob(existSubmission.getPlaceBirth())
                .dob(localDateToLocale(existSubmission.getDateOfBirth(), DATE_FORMAT))
                .gender(existSubmission.getGender())
                .nationality(existSubmission.getNationality())
                .religion(existSubmission.getReligion())
                .nik(existSubmission.getNik())
                .marriageStatus(existSubmission.getMarriageStatus())
                .jobType(existSubmission.getJobType())
                .address(existSubmission.getAddress())
                .typeLetters(types.stream().map(TypeLetter::getType).toList())
                .letterId(existSubmission.getLetterId())
                .monthPublished(localDateToString(dateNow, MONTH_PUBLISH_FORMAT))
                .datePublished(localDateToLocale(dateNow, DATE_FORMAT))
                .build());
        String firstName = getFirstName(existSubmission.getFullName());
        var template = writePdfFile(letterType, templateHtml, firstName);
        var content = getContent(template);
        var fileName = template.getName();
        cleanUpFile(template);
        return DownloadResponse.builder()
                .content(content)
                .fileName(fileName)
                .build();
    }

    private String getLetterType(String letterType) {
        var contains = StringUtils.contains(letterType, PATH);

        if (contains) {
            letterType = StringUtils.replace(letterType, PATH, OR);
        }

        return letterType;
    }

    private void cleanUpFile(File result) {
        try {
            Files.deleteIfExists(result.toPath());
        } catch (IOException e) {
            throw new AppRuntimeException(e);
        }
    }

    private String getFirstName(String fullName) {
        if (StringUtils.containsWhitespace(fullName)) {
            var splitFullName = fullName.split(" ");
            return splitFullName[0];
        }
        return fullName;
    }

    private byte[] getContent(File template) {
        try {
            return Files.readAllBytes(template.toPath());
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    }

    private void duplicateLetterRequest(String nik, List<TypeLetter> letters) {
        var existed = repository.existByNikAndType(nik, letters);
        if (existed) {
            throw new AppConflictException("Anda sudah mengajukan surat pengajuan. Silahkan ditunggu status pengajuan sebelumnya");
        }
    }
}
