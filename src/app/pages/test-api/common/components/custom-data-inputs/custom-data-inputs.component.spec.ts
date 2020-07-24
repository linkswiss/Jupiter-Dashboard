import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDataInputsComponent } from './custom-data-inputs.component';

describe('CustomDataInputsComponent', () => {
  let component: CustomDataInputsComponent;
  let fixture: ComponentFixture<CustomDataInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDataInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDataInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
