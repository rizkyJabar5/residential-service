package id.application.feature.service.impl;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.BrowserCallable;
import dev.hilla.Nonnull;
import dev.hilla.Nullable;
import dev.hilla.crud.filter.AndFilter;
import dev.hilla.crud.filter.Filter;
import dev.hilla.crud.filter.OrFilter;
import dev.hilla.crud.filter.PropertyStringFilter;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.response.AppUserDto;
import id.application.feature.model.entity.AppUser;
import id.application.feature.model.repositories.AppUserRepository;
import id.application.feature.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

import static id.application.util.FilterableUtil.pageable;

@RequiredArgsConstructor
@Service
//@RolesAllowed(value = {"ADMIN", "RT", "RW"})
@AnonymousAllowed
public class AppUserServiceImpl implements AppUserService {
    private final AppUserRepository userRepository;

    @Override
    public Page<AppUser> findAll(RequestPagination request) {
        var pageable = pageable(request.page(), request.limitContent(), request.sort());
        return userRepository.findAll(pageable);
    }

//    @Override
//    public @Nonnull List<@Nonnull AppUserDto> list(Pageable pageable, @Nullable Filter filter) {
//        pageable = createPageRequest(pageable);
//        // Create JPA specification from Hilla filter
//        var specification = createSpecification(filter);
//        // Fetch data from JPA repository
//        return userRepository.findAll(specification, pageable)
//                .map(user -> {
//                    var userInfo = user.getUserInfo();
//
//                    return AppUserDto.builder()
//                            .name(user.getName())
//                            .createdTime(user.getCreatedTime())
//                            .email(user.getUsername())
//                            .role(user.getRole())
//                            .userInfo(userInfo != null ? AppUserDto.UserInfoDto.builder()
//                                    .phoneNumber(userInfo.getPhoneNumber())
//                                    .statusRegistered(userInfo.getStatusRegistered())
//                                    .citizenId(userInfo.getCitizenId())
//                                    .build() : null)
//                            .build();
//                })
//                .toList();
//    }
//
//    private Pageable createPageRequest(Pageable pageable) {
//        var sortOrders = pageable.getSort().stream()
//                .map(order -> {
//                    String mappedProperty = switch (order.getProperty()) {
//                        case "name" -> "name";
//                        case "email" -> "email";
//                        case "statusRegistered" -> "statusRegistered";
//                        default -> throw new IllegalArgumentException("Unknown sort property " + order.getProperty());
//                    };
//                    return order.isAscending()
//                            ? Sort.Order.asc(mappedProperty)
//                            : Sort.Order.desc(mappedProperty);
//                }).toList();
//
//        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortOrders));
//    }
//
//    private Specification<AppUser> createSpecification(Filter filter) {
//        if (filter == null) {
//            return Specification.anyOf();
//        }
//
//        if (filter instanceof AndFilter andFilter) {
//            return Specification.allOf(andFilter.getChildren().stream()
//                    .map(this::createSpecification).toList());
//        } else if (filter instanceof OrFilter orFilter) {
//            return Specification.anyOf(orFilter.getChildren().stream()
//                    .map(this::createSpecification).toList());
//        } else if (filter instanceof PropertyStringFilter propertyFilter) {
//            return filterProperty(propertyFilter);
//        } else {
//            throw new IllegalArgumentException("Unknown filter type " + filter.getClass().getName());
//        }
//    }
//
//    private static Specification<AppUser> filterProperty(PropertyStringFilter filter) {
//        String filterValue = filter.getFilterValue();
//
//        return (root, query, criteriaBuilder) -> switch (filter.getPropertyId()) {
//            case "name" -> criteriaBuilder.like(root.get("name"), "%" + filterValue + "%");
//            case "email" -> criteriaBuilder.like(root.get("email"), "%" + filterValue + "%");
//            case "statusRegistered" -> criteriaBuilder.like(root.get("statusRegistered"), filterValue + "%");
////            case "supplierInfo" -> criteriaBuilder.or(
////                    criteriaBuilder.like(root.get("supplier").get("supplierName"), "%" + filterValue + "%"),
////                    criteriaBuilder.like(root.get("supplier").get("headquarterCity"), "%" + filterValue + "%")
////            );
//            default -> throw new IllegalArgumentException("Unknown filter property " + filter.getPropertyId());
//        };
//    }
}
