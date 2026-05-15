import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAppointments } from './appointments';

describe('Appointments', () => {
  let component: ClientAppointments;
  let fixture: ComponentFixture<ClientAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAppointments],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
