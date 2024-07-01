package id.application.feature.service;

import id.application.feature.dto.request.NewsRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.NewsDto;
import id.application.feature.dto.response.PageResponse;

public interface NewsService {
    BaseResponse<PageResponse<NewsDto>> findAll(RequestPagination request);

    BaseResponse<NewsDto> persist(NewsRequest request);

    BaseResponse<NewsDto> findById(String id);
}
