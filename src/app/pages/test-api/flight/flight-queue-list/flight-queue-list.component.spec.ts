import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightQueueListComponent } from './flight-queue-list.component';

describe('FlightQueueListComponent', () => {
  let component: FlightQueueListComponent;
  let fixture: ComponentFixture<FlightQueueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightQueueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightQueueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
