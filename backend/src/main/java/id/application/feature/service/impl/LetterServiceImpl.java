package id.application.feature.service.impl;

import id.application.config.pdf.TemplateConfig;
import id.application.exception.AppConflictException;
import id.application.exception.ResourceNotFoundException;
import id.application.feature.dto.request.LetterAddRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.request.UpdateLetterStatusRequest;
import id.application.feature.model.entity.LetterRequest;
import id.application.feature.model.repositories.LetterRequestRepository;
import id.application.feature.service.LetterService;
import id.application.util.FilterableUtil;
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
import java.util.Date;

import static id.application.config.pdf.PdfConfig.writePdfFile;
import static id.application.security.SecurityUtils.getUserLoggedIn;
import static id.application.util.ConverterDateTime.convertToLocalDateDefaultPattern;
import static id.application.util.ConverterDateTime.localDateToString;
import static id.application.util.EntityUtil.persistUtil;
import static id.application.util.FilterableUtil.pageable;

@RequiredArgsConstructor
@Service
public class LetterServiceImpl implements LetterService {
    private final LetterRequestRepository repository;
    private final TemplateConfig templateConfig;

    @Override
    public Page<LetterRequest> findAll(RequestPagination request) {
        getUserLoggedIn();

        var sortByCreatedTime = Sort.by(Sort.Order.asc("createdTime"));
        var pageable = pageable(request.page(), request.limitContent(), sortByCreatedTime);
        return repository.findAll(pageable);
    }

    @Override
    public Page<LetterRequest> findLetterByStatus(StatusLetter status) {
        getUserLoggedIn();
        var pageable = FilterableUtil.pageable(null, null, null);
        return repository.findByLetterStatus(status, pageable);
    }

    @Override
    public LetterRequest findById(String id) {
        getUserLoggedIn();
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Surat pengajuan tidak ditemukan"));
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
        var citizenId = authenticatedUser.getUserInfo().getCitizenId();
        var userLoggedIn = authenticatedUser.getName();

        var nik = request.nik();
        this.duplicateLetterRequest(nik, request.type());
        var entity = repository.findLetterRejected(nik).orElse(new LetterRequest());
        entity.generateLetterId();
        entity.setCitizenId(citizenId);
        entity.setFullName(request.fullName());
        entity.setPlaceBirth(request.pob());
        entity.setDateOfBirth(convertToLocalDateDefaultPattern(request.dob()));
        entity.setGender(request.gender());
        entity.setNationality(request.nationality());
        entity.setReligion(request.religion());
        entity.setNik(request.nik());
        entity.setMarriageStatus(request.marriageStatus());
        entity.setJobType(request.jobType());
        entity.setAddress(request.jobType());
        entity.setType(request.type());
        entity.setStatus(StatusLetter.WAITING);
        persistUtil(entity, userLoggedIn);

        return repository.saveAndFlush(entity);
    }

    @Override
    public void updateStatusLetter(UpdateLetterStatusRequest request) {
        var authenticatedUser = getUserLoggedIn();
        var existLetter = repository.findById(request.letterId())
                .orElseThrow(() -> new ResourceNotFoundException("Surat pengajuan tidak ditemukan"));

        var statusLetter = StatusLetter.valueOf(request.status());
        existLetter.setStatus(statusLetter);
        existLetter.setUpdatedBy(authenticatedUser.getName());
        existLetter.setUpdatedTime(new Date(System.currentTimeMillis()));

        repository.save(existLetter);
    }

    @Override
    public byte[] downloadLetter(String letterId) {
        var existSubmission = repository.findByLetterId(letterId)
                .orElseThrow();

        var templateHtml = templateConfig.ruEnrichProcessor(LetterAddRequest.builder()
                .fullName(existSubmission.getFullName())
                .pob(existSubmission.getPlaceBirth())
                .dob(localDateToString(existSubmission.getDateOfBirth()))
                .gender(existSubmission.getGender())
                .nationality(existSubmission.getNationality())
                .religion(existSubmission.getReligion())
                .nik(existSubmission.getNik())
                .marriageStatus(existSubmission.getMarriageStatus())
                .jobType(existSubmission.getJobType())
                .address(existSubmission.getAddress())
                .type(existSubmission.getType())
                .build());
        var template = writePdfFile(templateHtml, getFirstName(existSubmission.getFullName()));
        return getContent(template);
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

    private void duplicateLetterRequest(String nik, TypeLetter type) {
        var existed = repository.existByNikAndType(nik, type);
        if (existed) {
            throw new AppConflictException("Anda sudah mengajukan surat pengajuan. Silahkan ditunggu status pengajuan sebelumnya");
        }
    }
}
