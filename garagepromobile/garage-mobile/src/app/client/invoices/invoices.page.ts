import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user';
import { InvoiceService, Invoice } from '../../core/services/invoice';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss']
})
export class InvoicesPage implements OnInit {
  invoices: Invoice[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private invoiceService: InvoiceService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe(user => {
      this.invoiceService.getByClient(user.id).subscribe({
        next: data => {
          this.invoices = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    });
  }

  downloadPdf(invoice: Invoice): void {
    this.invoiceService.downloadPdf(invoice.id).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: () => this.showToast('Téléchargement impossible')
    });
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      color: 'danger'
    });

    await toast.present();
  }
}
