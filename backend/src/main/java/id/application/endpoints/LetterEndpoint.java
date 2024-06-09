package id.application.endpoints;

import id.application.feature.dto.request.LetterAddRequest;
import id.application.feature.dto.request.RequestPagination;
import id.application.feature.dto.request.UpdateLetterStatusRequest;
import id.application.feature.model.entity.LetterRequest;
import id.application.feature.service.LetterService;
import id.application.util.enums.StatusLetter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/letters")
@Validated
public class LetterEndpoint {
    private final LetterService service;

    @GetMapping
    public Page<LetterRequest> getAllLetter(RequestPagination pageRequest){
        var contents = service.findAll(pageRequest);
        return contents;
    }

    @GetMapping("/status")
    public Page<LetterRequest> getLetterByStatus(@RequestParam int status){
        var statusLetter = StatusLetter.valueOf(status);
        Page<LetterRequest> contents = service.findLetterByStatus(statusLetter);
        return contents;
    }

    @GetMapping("/{id}")
    public LetterRequest getLetterById(@PathVariable String id){
        var content = service.findById(id);
        return content;
    }

    @GetMapping("/letter/{nik}")
    public LetterRequest getLetterByLetterId(@PathVariable String nik){
        var content = service.findByLetterId(nik);
        return content;
    }

    @PostMapping
    public LetterRequest createLetter(@RequestBody LetterAddRequest request){
        var content = service.persistNew(request);
        return content;
    }

    @PutMapping
    public void updateStatusLetter(@RequestBody UpdateLetterStatusRequest request){
        service.updateStatusLetter(request);
    }

    @GetMapping("/download/{letterId}")
    public byte[] downloadSubmissionLetter(@PathVariable String letterId){
        var content = service.downloadLetter(letterId);
        return content;
    }
}
