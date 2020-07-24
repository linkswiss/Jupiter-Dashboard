import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDebugAccordionComponent } from './api-debug-accordion.component';

describe('ApiDebugAccordionComponent', () => {
  let component: ApiDebugAccordionComponent;
  let fixture: ComponentFixture<ApiDebugAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiDebugAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiDebugAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
