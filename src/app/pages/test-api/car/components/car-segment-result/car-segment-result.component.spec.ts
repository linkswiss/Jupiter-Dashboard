import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarSegmentResultComponent } from './car-segment-result.component';

describe('CarSegmentResultComponent', () => {
  let component: CarSegmentResultComponent;
  let fixture: ComponentFixture<CarSegmentResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarSegmentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarSegmentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
