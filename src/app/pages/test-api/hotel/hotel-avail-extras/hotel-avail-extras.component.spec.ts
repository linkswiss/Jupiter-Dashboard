import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelAvailExtrasComponent } from './hotel-avail-extras.component';

describe('HotelAvailExtrasComponent', () => {
  let component: HotelAvailExtrasComponent;
  let fixture: ComponentFixture<HotelAvailExtrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelAvailExtrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelAvailExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
