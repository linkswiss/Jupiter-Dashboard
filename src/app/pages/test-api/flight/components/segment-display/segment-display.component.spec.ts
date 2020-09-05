import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentDisplayComponent } from './segment-display.component';

describe('SegmentDisplayComponent', () => {
  let component: SegmentDisplayComponent;
  let fixture: ComponentFixture<SegmentDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
