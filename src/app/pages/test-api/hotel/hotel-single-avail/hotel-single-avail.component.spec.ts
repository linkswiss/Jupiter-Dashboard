import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSingleAvailComponent } from './hotel-single-avail.component';

describe('HotelSingleAvailComponent', () => {
  let component: HotelSingleAvailComponent;
  let fixture: ComponentFixture<HotelSingleAvailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSingleAvailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSingleAvailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
