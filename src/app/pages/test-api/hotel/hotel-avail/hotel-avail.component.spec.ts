import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelAvailComponent } from './hotel-avail.component';

describe('HotelAvailComponent', () => {
  let component: HotelAvailComponent;
  let fixture: ComponentFixture<HotelAvailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelAvailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelAvailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
