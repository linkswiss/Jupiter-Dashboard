import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomsAvailComponent } from './hotel-rooms-avail.component';

describe('HotelRoomsAvailComponent', () => {
  let component: HotelRoomsAvailComponent;
  let fixture: ComponentFixture<HotelRoomsAvailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelRoomsAvailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelRoomsAvailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
