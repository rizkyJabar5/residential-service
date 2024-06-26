package id.application.config;

import com.cloudinary.Cloudinary;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Slf4j
public class CloudinaryConfig {

    @Value("${cloud.name}")
    private String name;
    @Value("${cloud.key}")
    private String key;
    @Value("${cloud.secret}")
    private String secret;

    public Cloudinary cloudinaryConfig(){
        Map<String, Object> config = new HashMap<>();
        config.put("cloud_name", name);
        config.put("api_key", key);
        config.put("api_secret", secret);

        return new Cloudinary(config);
    }

    @SuppressWarnings("rawtypes")
    public Map upload(MultipartFile file, Map options) {

        try {
            return cloudinaryConfig()
                    .uploader()
                    .upload(file.getBytes(), options);
        }catch (IOException e) {
            log.error(e.getMessage());
            return Collections.emptyMap();
        }
    }

    @SuppressWarnings("rawtypes")
    public Map delete(String publicIdFile, Map options) {

        try {
            return cloudinaryConfig()
                    .uploader()
                    .destroy(publicIdFile, options);
        }catch (IOException e) {
            log.error(e.getMessage());
            return Collections.emptyMap();
        }
    }

}
