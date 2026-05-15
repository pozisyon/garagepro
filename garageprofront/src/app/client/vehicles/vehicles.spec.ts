import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVehicles } from './vehicles';

describe('Vehicles', () => {
  let component: ClientVehicles;
  let fixture: ComponentFixture<ClientVehicles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientVehicles],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientVehicles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
