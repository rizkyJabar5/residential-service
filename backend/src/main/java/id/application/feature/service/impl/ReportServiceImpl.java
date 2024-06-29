package id.application.feature.service.impl;

import com.cloudinary.utils.ObjectUtils;
import id.application.config.CloudinaryConfig;
import id.application.feature.dto.request.RequestAddReport;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.Report;
import id.application.feature.model.repositories.ReportRepository;
import id.application.feature.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

import static id.application.security.SecurityUtils.getUserLoggedIn;
import static id.application.util.ConverterDateTime.convertToDateDefaultPattern;
import static id.application.util.ConverterDateTime.today;
import static id.application.util.EntityUtil.persistUtil;
import static id.application.util.FilterableUtil.pageable;

@RequiredArgsConstructor
@Service
@Slf4j
public class ReportServiceImpl implements ReportService {
    private final ReportRepository reportRepository;
    private final CloudinaryConfig cloudinaryConfig;

    @Override
    public Page<Report> findAll(RequestPagination request) {
        var sortByCreatedTime = Sort.by(Sort.Order.desc("createdTime"));
        var pageable = pageable(request.page(), request.limitContent(), sortByCreatedTime);
        return reportRepository.findAll(pageable);
    }

    @Override
    public Page<Report> findReportByDate(String date, RequestPagination request) {
        var sortByCreatedTime = Sort.by(Sort.Order.asc("createdTime"));
        var pageable = pageable(request.page(), request.limitContent(), sortByCreatedTime);

        return reportRepository.findReportByDate(filterByDate(date), pageable);
    }

    @Override
    public Report persistNew(RequestAddReport request, MultipartFile image) {
        var authenticatedUser = getUserLoggedIn();

        var entity = new Report();
        entity.setName(request.name());
        entity.setLocation(request.location());
        if (image != null && !image.isEmpty()) {
            String imageUrl = getUrlAndUploadImage(image);
            entity.setImageUrl(imageUrl);
        } else {
            entity.setImageUrl(null);
        }
        entity.setTypeFacility(request.typeFacility());
        assert authenticatedUser != null;
        entity.setCitizenId(authenticatedUser.getUserInfo().getCitizenId());

        persistUtil(entity, authenticatedUser.getName());

        return reportRepository.saveAndFlush(entity);
    }

    private String getUrlAndUploadImage(MultipartFile image) {
        return cloudinaryConfig.upload(image,
                        ObjectUtils.asMap(
                                "resourceType", "image",
                                "folder", "journal-backend/"))
                .get("url").toString();
    }

    private Date filterByDate(String date) {
        return date == null || date.isEmpty() ? today() : convertToDateDefaultPattern(date);
    }
}
