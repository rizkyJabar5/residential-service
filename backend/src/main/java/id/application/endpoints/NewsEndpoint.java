package id.application.endpoints;

import id.application.feature.dto.request.NewsRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.BaseResponse;
import id.application.feature.dto.response.NewsDto;
import id.application.feature.dto.response.PageResponse;
import id.application.feature.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/news")
@Validated
public class NewsEndpoint {
    private final NewsService service;

    @GetMapping
    public BaseResponse<PageResponse<NewsDto>> getAllNews(@RequestParam(defaultValue = "0") Integer page,
                                                          @RequestParam(defaultValue = "10") Integer limitContent) {
        return service.findAll(RequestPagination.builder()
                .page(page)
                .limitContent(limitContent)
                .build()
        );
    }

    @PostMapping
    public BaseResponse<NewsDto> persistNews(@RequestBody NewsRequest request) {
        return service.persist(request);
    }

    @GetMapping("/{id}")
    public BaseResponse<NewsDto> getNewsById(@PathVariable String id) {
        return service.findById(id);
    }
}
