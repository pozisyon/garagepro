import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceService, Invoice } from '../../core/services/invoice';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-client-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class ClientInvoices implements OnInit {

  invoices: Invoice[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe(user => {
      this.invoiceService.getByClient(user.id).subscribe({
        next: data => {
          this.invoices = data;
          this.loading = false;
        }
      });
    });
  }
}
