import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleHotelDetailsComponent } from './single-hotel-details.component';

describe('SingleHotelDetailsCardComponent', () => {
  let component: SingleHotelDetailsComponent;
  let fixture: ComponentFixture<SingleHotelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleHotelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleHotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
