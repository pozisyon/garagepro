import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicRepairs } from './repairs';

describe('Repairs', () => {
  let component: MechanicRepairs;
  let fixture: ComponentFixture<MechanicRepairs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicRepairs],
    }).compileComponents();

    fixture = TestBed.createComponent(MechanicRepairs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
