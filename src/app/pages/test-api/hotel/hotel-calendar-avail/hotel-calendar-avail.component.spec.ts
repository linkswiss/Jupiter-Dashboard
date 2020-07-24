import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCalendarAvailComponent } from './hotel-calendar-avail.component';

describe('HotelCalendarAvailComponent', () => {
  let component: HotelCalendarAvailComponent;
  let fixture: ComponentFixture<HotelCalendarAvailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCalendarAvailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCalendarAvailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
