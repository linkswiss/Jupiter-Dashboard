import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPnrRetrieveComponent } from './flight-pnr-retrieve.component';

describe('FlightPnrRetrieveComponent', () => {
  let component: FlightPnrRetrieveComponent;
  let fixture: ComponentFixture<FlightPnrRetrieveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPnrRetrieveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPnrRetrieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
