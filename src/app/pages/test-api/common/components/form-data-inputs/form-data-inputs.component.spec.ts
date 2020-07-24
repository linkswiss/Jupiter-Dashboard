import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDataInputsComponent } from './form-data-inputs.component';

describe('FormDataInputsComponent', () => {
  let component: FormDataInputsComponent;
  let fixture: ComponentFixture<FormDataInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDataInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDataInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
