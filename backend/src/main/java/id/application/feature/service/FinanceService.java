package id.application.feature.service;

import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.ResponseFinanceDTO;
import id.application.feature.model.entity.Finance;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface FinanceService {

    Page<ResponseFinanceDTO> getAllFinances(RequestPagination requestPagination);

    @Transactional
    Finance persistNewFinance(MultipartFile image, String note);
}
