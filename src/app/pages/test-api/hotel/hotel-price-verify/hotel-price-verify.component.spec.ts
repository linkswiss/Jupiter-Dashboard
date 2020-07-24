import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPriceVerifyComponent } from './hotel-price-verify.component';

describe('HotelPriceVerifyComponent', () => {
  let component: HotelPriceVerifyComponent;
  let fixture: ComponentFixture<HotelPriceVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelPriceVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelPriceVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
