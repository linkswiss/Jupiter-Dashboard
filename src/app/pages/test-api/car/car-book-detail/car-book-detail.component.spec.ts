import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarBookDetailComponent } from './car-book-detail.component';

describe('CarBookDetailComponent', () => {
  let component: CarBookDetailComponent;
  let fixture: ComponentFixture<CarBookDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarBookDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarBookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
