package id.application.feature.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
public class ResponseFinanceDTO implements Serializable {
    private String id;
    private CitizenDto citizen;
    private AppUserDto appUserDto;
    private String imageUrl;
    private String note;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date tglPembayaran;
}




