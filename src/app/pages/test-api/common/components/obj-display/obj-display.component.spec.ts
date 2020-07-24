import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjDisplayComponent } from './obj-display.component';

describe('ObjDisplayComponent', () => {
  let component: ObjDisplayComponent;
  let fixture: ComponentFixture<ObjDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
