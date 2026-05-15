import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService, Invoice, InvoiceItem } from '../../core/services/invoice';
import { RepairService, Repair } from '../../core/services/repair';

@Component({
  selector: 'app-admin-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class AdminInvoices implements OnInit {

  invoices: Invoice[] = [];
  repairs: Repair[] = [];

  selectedRepairId: number | null = null;

  loading = false;
  error: string | null = null;
  success: string | null = null;

  statuses = ['DRAFT', 'UNPAID', 'PAID', 'CANCELLED'];

  form: Invoice = {
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0
      }
    ]
  };

  constructor(
    private invoiceService: InvoiceService,
    private repairService: RepairService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.invoiceService.getAll().subscribe({
      next: data => {
        this.invoices = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement factures';
        this.loading = false;
      }
    });

    this.repairService.getAll().subscribe({
      next: data => {
        this.repairs = data;
      }
    });
  }

  addItem(): void {
    this.form.items.push({
      description: '',
      quantity: 1,
      unitPrice: 0
    });
  }

  removeItem(index: number): void {
    if (this.form.items.length === 1) return;
    this.form.items.splice(index, 1);
  }

  getLocalSubtotal(): number {
    return this.form.items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0) * Number(item.unitPrice || 0);
    }, 0);
  }

  createInvoice(): void {
    if (!this.selectedRepairId) {
      this.error = 'Veuillez sélectionner une réparation';
      return;
    }

    this.invoiceService
      .createFromRepair(Number(this.selectedRepairId), this.form)
      .subscribe({
        next: () => {
          this.success = 'Facture créée avec succès';
          this.error = null;
          this.resetForm();
          this.loadData();
        },
        error: () => {
          this.error = 'Erreur lors de la création de la facture';
          this.success = null;
        }
      });
  }

  changeStatus(invoice: Invoice, status: string): void {
    if (!invoice.id) return;

    this.invoiceService.updateStatus(invoice.id, status).subscribe({
      next: updated => invoice.status = <string>updated.status,
      error: () => this.error = 'Erreur changement statut facture'
    });
  }

  deleteInvoice(id?: number): void {
    if (!id) return;
    if (!confirm('Supprimer cette facture ?')) return;

    this.invoiceService.delete(id).subscribe({
      next: () => this.invoices = this.invoices.filter(i => i.id !== id),
      error: () => this.error = 'Erreur lors de la suppression'
    });
  }

  resetForm(): void {
    this.selectedRepairId = null;

    this.form = {
      items: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0
        }
      ]
    };
  }

  downloadPdf(id?: number): void {
    if (!id) return;

    this.invoiceService.downloadPdf(id).subscribe(blob => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${id}.pdf`;

      a.click();

      window.URL.revokeObjectURL(url);
    });
  }

}
