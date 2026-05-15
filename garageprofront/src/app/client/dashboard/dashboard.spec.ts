import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDashboard } from './dashboard';

describe('Dashboard', () => {
  let component: ClientDashboard ;
  let fixture: ComponentFixture<ClientDashboard >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDashboard ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDashboard );
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
