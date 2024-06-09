package id.application.feature.service.impl;

import com.cloudinary.utils.ObjectUtils;
import id.application.config.CloudinaryConfig;
import id.application.feature.dto.request.RequestAddReport;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.model.entity.Report;
import id.application.feature.model.repositories.ReportRepository;
import id.application.feature.service.ReportService;
import id.application.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

import static id.application.util.ConverterDateTime.convertToDateDefaultPattern;
import static id.application.util.ConverterDateTime.today;
import static id.application.util.EntityUtil.persistUtil;
import static id.application.util.FilterableUtil.pageable;

@RequiredArgsConstructor
@Service
public class ReportServiceImpl implements ReportService {
    private final ReportRepository reportRepository;
    private final SecurityUtils securityUtil;
    private final CloudinaryConfig cloudinaryConfig;

    @Override
    public Page<Report> findAll(RequestPagination pagination) {
        var pageable = pageable(pagination.page(), pagination.limitContent(), pagination.sort());
        return reportRepository.findAll(pageable);
    }

    @Override
    public Page<Report> findReportByDate(String date, RequestPagination pagination) {
        var pageable = pageable(pagination.page(), pagination.limitContent(), pagination.sort());

        return reportRepository.findReportByDate(filterByDate(date), pageable);
    }

    @Override
    public Report persistNew(RequestAddReport request) {
        var authenticatedUser = securityUtil.getAppUserLoggedIn();

        var entity = new Report();
        entity.setName(request.title());
        entity.setLocation(request.location());
        var urlImage = getUrlAndUploadImage(request.image());
        entity.setImageUrl(urlImage);
        entity.setTypeFacility(request.typeFacility());
        entity.setCitizenId(authenticatedUser.userInfo().citizenId());

        persistUtil(entity, authenticatedUser.name());

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
