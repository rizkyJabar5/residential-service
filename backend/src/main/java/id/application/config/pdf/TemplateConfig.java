package id.application.config.pdf;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import id.application.exception.AppRuntimeException;
import id.application.feature.dto.request.TemplateRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class TemplateConfig {
    public static final int WIDTH = 300;
    public static final int HEIGHT = 300;
    public static final String PNG = "png";
    private final SpringTemplateEngine templateEngine;

    public String ruEnrichProcessor(TemplateRequest request) {
        var arg = this.mappingArgument(request);
        var context = new Context();
        context.setLocale(Locale.ENGLISH);
        context.setVariables(arg);

        return this.templateEngine.process("template-letter", context);
    }

    private Map<String, Object> mappingArgument(TemplateRequest request) {
        var codeRT = generateQR("Ahmad Zubair", "rt");
        var codeRW = generateQR("JUMAIL, M.Sc", "rw");

        var argument = new HashMap<String, Object>();
        argument.put("fullName", request.fullName());
        argument.put("pobAndDob", String.format("%s/%s", request.pob(), request.dob()));
        argument.put("gender", request.gender().getName());
        argument.put("nationalityAndReligion", String.format("%s / %s", request.nationality(), request.religion().getName()));
        argument.put("nik", request.nik());
        argument.put("marriageStatus", request.marriageStatus().getStatus());
        argument.put("jobType", request.jobType());
        argument.put("address", request.address());
        argument.put("type", request.typeLetter());
        argument.put("letterId", request.letterId());
        argument.put("monthPublished", request.monthPublished());
        argument.put("datePublished", request.datePublished());
        argument.put("signRT", codeRT);
        argument.put("signRW", codeRW);
        return argument;
    }

    private File generateQR(String content, String filename) {
        try {
            var path = new ClassPathResource("templates/");
            var file = new File(path.getURI().getPath() + filename + ".png");
            var hints = getEncodeHintTypeErrorCorrectionLevel();
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            var byteMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, WIDTH, HEIGHT, hints);

            int matrixWidth = byteMatrix.getWidth();
            int matrixHeight = byteMatrix.getHeight();
            var image = new BufferedImage(matrixWidth, matrixHeight, BufferedImage.TYPE_INT_RGB);
            image.createGraphics();

            var graphics = (Graphics2D) image.getGraphics();
            graphics.setColor(Color.WHITE);
            graphics.fillRect(0, 0, matrixWidth, matrixWidth);
            graphics.setColor(Color.BLACK);

            for (var i = 0; i < matrixWidth; i++) {
                for (int j = 0; j < matrixWidth; j++) {
                    if (byteMatrix.get(i, j)) {
                        graphics.fillRect(i, j, 1, 1);
                    }
                }
            }

            ImageIO.write(image, PNG, file);

            return file;
        } catch (Exception e) {
            throw new AppRuntimeException(e);
        }
    }

    @NotNull
    private static EnumMap<EncodeHintType, ErrorCorrectionLevel> getEncodeHintTypeErrorCorrectionLevel() {
        var hints = new EnumMap<EncodeHintType, ErrorCorrectionLevel>(EncodeHintType.class);
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        return hints;
    }
}
