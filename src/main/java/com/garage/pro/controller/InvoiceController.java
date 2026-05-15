package com.garage.pro.controller;


import com.garage.pro.model.*;
import com.garage.pro.repository.*;
import com.garage.pro.service.InvoicePdfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {

    private static final double TAX_RATE = 0.14975;

    private final InvoiceRepository invoiceRepository;
    private final RepairRepository repairRepository;
    private final InvoicePdfService invoicePdfService;
    public InvoiceController(
            InvoiceRepository invoiceRepository,
            RepairRepository repairRepository,
            InvoicePdfService invoicePdfService
    ) {
        this.invoiceRepository = invoiceRepository;
        this.repairRepository = repairRepository;
        this.invoicePdfService = invoicePdfService;
    }

    @GetMapping
    public List<Invoice> getAll() {
        return invoiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public Invoice getById(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));
    }

    @GetMapping("/client/{clientId}")
    public List<Invoice> getByClient(@PathVariable Long clientId) {
        return invoiceRepository.findByClientId(clientId);
    }

    @GetMapping("/repair/{repairId}")
    public Invoice getByRepair(@PathVariable Long repairId) {
        return invoiceRepository.findByRepairId(repairId)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));
    }

    @PostMapping("/repair/{repairId}")
    public Invoice createFromRepair(
            @PathVariable Long repairId,
            @RequestBody Invoice invoice
    ) {
        Repair repair = repairRepository.findById(repairId)
                .orElseThrow(() -> new RuntimeException("Réparation introuvable"));

        invoice.setRepair(repair);
        invoice.setClient(repair.getClient());
        invoice.setIssuedAt(LocalDateTime.now());
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setStatus(InvoiceStatus.UNPAID);

        if (invoice.getItems() != null) {
            invoice.getItems().forEach(item -> {
                item.setInvoice(invoice);
                item.setLineTotal(item.getQuantity() * item.getUnitPrice());
            });
        }

        calculateTotals(invoice);

        return invoiceRepository.save(invoice);
    }

    @PutMapping("/{id}")
    public Invoice update(
            @PathVariable Long id,
            @RequestBody Invoice data
    ) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        invoice.getItems().clear();

        if (data.getItems() != null) {
            data.getItems().forEach(item -> {
                item.setInvoice(invoice);
                item.setLineTotal(item.getQuantity() * item.getUnitPrice());
                invoice.getItems().add(item);
            });
        }

        calculateTotals(invoice);

        return invoiceRepository.save(invoice);
    }

    @PatchMapping("/{id}/status")
    public Invoice updateStatus(
            @PathVariable Long id,
            @RequestParam InvoiceStatus status
    ) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        invoice.setStatus(status);

        return invoiceRepository.save(invoice);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        invoiceRepository.deleteById(id);
    }

    private void calculateTotals(Invoice invoice) {
        double subtotal = invoice.getItems()
                .stream()
                .mapToDouble(InvoiceItem::getLineTotal)
                .sum();

        double taxAmount = subtotal * TAX_RATE;
        double total = subtotal + taxAmount;

        invoice.setSubtotal(round(subtotal));
        invoice.setTaxAmount(round(taxAmount));
        invoice.setTotal(round(total));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {

        byte[] pdf = invoicePdfService.generateInvoicePdf(id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=facture-" + id + ".pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    private String generateInvoiceNumber() {
        return "INV-" + LocalDateTime.now().getYear() + "-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
