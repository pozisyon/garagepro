import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInvoices } from './invoices';

describe('Invoices', () => {
  let component: ClientInvoices;
  let fixture: ComponentFixture<ClientInvoices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientInvoices],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientInvoices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
