package id.application.feature.service;

import id.application.feature.dto.request.LetterAddRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.request.UpdateLetterStatusRequest;
import id.application.feature.dto.response.DownloadResponse;
import id.application.feature.model.entity.LetterRequest;
import id.application.util.enums.StatusLetter;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;

public interface LetterService {
    Page<LetterRequest> findAll(RequestPagination pageRequest);

    Page<LetterRequest> findLetterByStatus(StatusLetter status);

    LetterRequest findById(String id);

    LetterRequest findByLetterId(String nik);

    @Transactional
    LetterRequest persistNew(LetterAddRequest request);

    void updateStatusLetter(UpdateLetterStatusRequest request);

    DownloadResponse downloadLetter(String letterId);
}
