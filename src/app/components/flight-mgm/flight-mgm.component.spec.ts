import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightMgmComponent } from './flight-mgm.component';

describe('FlightMgmComponent', () => {
  let component: FlightMgmComponent;
  let fixture: ComponentFixture<FlightMgmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightMgmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
