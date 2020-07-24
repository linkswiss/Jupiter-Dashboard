import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookSearchComponent } from './hotel-book-search.component';

describe('HotelBookSearchComponent', () => {
  let component: HotelBookSearchComponent;
  let fixture: ComponentFixture<HotelBookSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
