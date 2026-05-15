package com.garage.pro.service;

import com.garage.pro.model.Invoice;
import com.garage.pro.model.InvoiceItem;
import com.garage.pro.repository.InvoiceRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class InvoicePdfService {

    private final InvoiceRepository invoiceRepository;

    public InvoicePdfService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public byte[] generateInvoicePdf(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // TITRE
        Paragraph title = new Paragraph("FACTURE")
                .setBold()
                .setFontSize(26)
                .setFontColor(ColorConstants.ORANGE);

        document.add(title);

        document.add(new Paragraph(" "));

        // INFOS FACTURE
        document.add(new Paragraph("Numéro : " + invoice.getInvoiceNumber()));
        document.add(new Paragraph("Date : " + invoice.getIssuedAt()));
        document.add(new Paragraph("Client : " + invoice.getClient().getFullName()));
        document.add(new Paragraph("Email : " + invoice.getClient().getEmail()));

        document.add(new Paragraph(" "));

        // TABLEAU
        Table table = new Table(UnitValue.createPercentArray(new float[]{4, 2, 2, 2}))
                .useAllAvailableWidth();

        table.addHeaderCell("Description");
        table.addHeaderCell("Qté");
        table.addHeaderCell("Prix");
        table.addHeaderCell("Total");

        for (InvoiceItem item : invoice.getItems()) {

            table.addCell(item.getDescription());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell(String.format("%.2f $", item.getUnitPrice()));
            table.addCell(String.format("%.2f $", item.getLineTotal()));
        }

        document.add(table);

        document.add(new Paragraph(" "));

        // TOTAUX
        document.add(
                new Paragraph("Sous-total : " +
                        String.format("%.2f $", invoice.getSubtotal()))
                        .setBold()
        );

        document.add(
                new Paragraph("Taxes : " +
                        String.format("%.2f $", invoice.getTaxAmount()))
                        .setBold()
        );

        document.add(
                new Paragraph("TOTAL : " +
                        String.format("%.2f $", invoice.getTotal()))
                        .setBold()
                        .setFontSize(18)
                        .setFontColor(ColorConstants.BLUE)
        );

        document.add(new Paragraph(" "));

        document.add(
                new Paragraph("Merci de votre confiance.")
                        .setItalic()
        );

        document.close();

        return outputStream.toByteArray();
    }
}