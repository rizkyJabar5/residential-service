package id.application.feature.service.impl;

import id.application.exception.ResourceNotFoundException;
import id.application.feature.dto.request.NewsRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.NewsDto;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.model.entity.News;
import id.application.feature.model.repositories.NewsRepository;
import id.application.feature.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import static id.application.security.SecurityUtils.getUserLoggedIn;
import static id.application.util.ConverterDateTime.DD_MM_YYYY;
import static id.application.util.ConverterDateTime.stringToLocalDate;
import static id.application.util.EntityUtil.persistUtil;
import static id.application.util.FilterableUtil.mappingContentPage;
import static id.application.util.FilterableUtil.pageable;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_EMPTY;
import static id.application.util.constant.StatusCodeConstant.CODE_CONTENT_FOUND;

@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {
    private final NewsRepository repository;

    @Override
    public BaseResponse<PageResponse<NewsDto>> findAll(RequestPagination request) {
        var sortByCreatedTime = Sort.by(Sort.Order.desc("createdTime"));
        var pageable = pageable(request.page(), request.limitContent(), sortByCreatedTime);
        var content = repository.findAll(pageable);
        return BaseResponse.<PageResponse<NewsDto>>builder()
                .code(content.isEmpty() ? CODE_CONTENT_EMPTY : CODE_CONTENT_FOUND)
                .message(content.isEmpty() ? "Berita tidak ditemukan" : "Berita ditemukan")
                .data(PageResponse.<NewsDto>builder()
                        .size(content.getSize())
                        .totalElements(content.getTotalElements())
                        .totalPages(content.getTotalPages())
                        .numberOfElements(content.getNumberOfElements())
                        .pageOf(content.getPageable().getPageNumber())
                        .page(content.getPageable().getPageSize())
                        .content(mappingContentPage(content, NewsDto::entityToDto))
                        .build())
                .build();
    }

    @Override
    public BaseResponse<NewsDto> persist(NewsRequest request) {
        var userLoggedIn = getUserLoggedIn();
        var entity = repository.findByTitle(request.title(), stringToLocalDate(request.eventDate(), DD_MM_YYYY))
                .orElse(new News());
        entity.setTitle(request.title());
        entity.setEvent(request.event());
        entity.setLocation(request.location());
        entity.setEventDate(stringToLocalDate(request.eventDate(), DD_MM_YYYY));
        entity.setStartTime(request.startTime());
        entity.setEndTime(request.endTime());
        entity.setContent(request.content());

        persistUtil(entity, userLoggedIn.getName());
        var saved = repository.save(entity);

        return BaseResponse.<NewsDto>builder()
                .message("Berhasil menambahkan berita baru")
                .data(NewsDto.entityToDto(saved))
                .build();
    }

    @Override
    public BaseResponse<NewsDto> findById(String id) {
        News existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Berita tidak ditemukan"));
        return BaseResponse.<NewsDto>builder()
                .code(CODE_CONTENT_FOUND)
                .message("Berita ditemukan")
                .data(NewsDto.entityToDto(existing))
                .build();
    }
}
