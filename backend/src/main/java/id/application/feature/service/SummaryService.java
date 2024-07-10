package id.application.feature.service;

import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.SummaryAdmin;

public interface SummaryService {
    BaseResponse<SummaryAdmin> summaryAdmin();
}
