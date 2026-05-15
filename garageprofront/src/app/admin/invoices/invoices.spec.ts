import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvoices } from './invoices';

describe('Invoices', () => {
  let component: AdminInvoices;
  let fixture: ComponentFixture<AdminInvoices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInvoices],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInvoices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
