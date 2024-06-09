package id.application.endpoints;

import dev.hilla.Endpoint;
import id.application.feature.dto.request.LetterAddRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.request.UpdateLetterStatusRequest;
import id.application.feature.model.entity.LetterRequest;
import id.application.feature.service.LetterService;
import id.application.util.enums.StatusLetter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

@RequiredArgsConstructor
@Endpoint
public class LetterEndpoint {
    private final LetterService service;

    public Page<LetterRequest> getAllLetter(RequestPagination pageRequest){
        var contents = service.findAll(pageRequest);
        return contents;
    }

    public Page<LetterRequest> getLetterByStatus(StatusLetter status){
        Page<LetterRequest> contents = service.findLetterByStatus(status);
        return contents;
    }

    public LetterRequest getLetterById(String id){
        var content = service.findById(id);
        return content;
    }

    public LetterRequest getLetterByLetterId(String nik){
        var content = service.findByLetterId(nik);
        return content;
    }

    public LetterRequest createLetter(LetterAddRequest request){
        var content = service.persistNew(request);
        return content;
    }

    public void updateStatusLetter(UpdateLetterStatusRequest request){
        service.updateStatusLetter(request);
    }

    public byte[] downloadSubmissionLetter(String letterId){
        var content = service.downloadLetter(letterId);
        return content;
    }
}
