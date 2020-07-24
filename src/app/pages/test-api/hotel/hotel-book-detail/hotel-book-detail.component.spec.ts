import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookDetailComponent } from './hotel-book-detail.component';

describe('HotelBookDetailComponent', () => {
  let component: HotelBookDetailComponent;
  let fixture: ComponentFixture<HotelBookDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
