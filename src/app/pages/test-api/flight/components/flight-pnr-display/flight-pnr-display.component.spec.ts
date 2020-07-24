import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPnrDisplayComponent } from './flight-pnr-display.component';

describe('FlightPnrDisplayComponent', () => {
  let component: FlightPnrDisplayComponent;
  let fixture: ComponentFixture<FlightPnrDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPnrDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPnrDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
