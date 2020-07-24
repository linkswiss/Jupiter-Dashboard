import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainAvailComponent } from './train-avail.component';

describe('TrainAvailComponent', () => {
  let component: TrainAvailComponent;
  let fixture: ComponentFixture<TrainAvailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainAvailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainAvailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
