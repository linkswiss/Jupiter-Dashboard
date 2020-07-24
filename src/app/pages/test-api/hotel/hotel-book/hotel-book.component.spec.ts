import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookComponent } from './hotel-book.component';

describe('HotelBookComponent', () => {
  let component: HotelBookComponent;
  let fixture: ComponentFixture<HotelBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
