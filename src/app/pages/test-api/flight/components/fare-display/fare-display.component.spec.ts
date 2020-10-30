import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FareDisplayComponent } from './fare-display.component';

describe('FareDisplayComponent', () => {
  let component: FareDisplayComponent;
  let fixture: ComponentFixture<FareDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FareDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FareDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
