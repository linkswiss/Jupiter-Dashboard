import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAvailComponent } from './car-avail.component';

describe('CarAvailComponent', () => {
  let component: CarAvailComponent;
  let fixture: ComponentFixture<CarAvailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarAvailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAvailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
