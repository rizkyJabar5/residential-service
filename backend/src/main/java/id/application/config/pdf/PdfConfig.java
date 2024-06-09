package id.application.config.pdf;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.DocumentProperties;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.IBlockElement;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.BaseDirection;
import com.itextpdf.layout.properties.UnitValue;
import id.application.exception.AppConflictException;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import static id.application.config.pdf.PDFComponentUtil.fileName;


@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PdfConfig {

    public static File writePdfFile(String headerHtml,
                                    String name) {
        var fileName = fileName(name);
        var file = new File(fileName);

        try (var fileOutputStream = new FileOutputStream(file);
             var document = getSpecificationDocument(fileOutputStream)) {
            var headerContent = buildContentDownload(headerHtml);

            document.add(headerContent);
        } catch (IOException e) {
            throw new AppConflictException(e);
        }

        return file;
    }

    public static Table buildContentDownload(String headerHtml) {
        var table = new Table(1);
        table.setKeepTogether(true);
        table.setMargin(0);
        table.setWidth(UnitValue.createPercentValue(100));

        var cell = new Cell();
        cell.setBorder(Border.NO_BORDER);

        var properties = new ConverterProperties();
        var elements = HtmlConverter.convertToElements(headerHtml, properties);

        elements.forEach(element -> cell.add((IBlockElement) element));

        table.addCell(cell);
        table.setMarginBottom(10f);

        return table;
    }

    private static Document getSpecificationDocument(FileOutputStream fileOutputStream) {
        var writer = new PdfWriter(fileOutputStream);
        var documentProperties = new DocumentProperties();
        var pdfDoc = new PdfDocument(writer, documentProperties);
        pdfDoc.setDefaultPageSize(PageSize.A4);

        var document = new Document(pdfDoc, PageSize.A4, false);
        document.setLeftMargin(40f);
        document.setRightMargin(40f);
        document.setBaseDirection(BaseDirection.LEFT_TO_RIGHT);

        return document;
    }
}

