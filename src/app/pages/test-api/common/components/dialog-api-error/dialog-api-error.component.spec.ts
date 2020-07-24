import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogApiErrorComponent } from './dialog-api-error.component';

describe('DialogApiErrorComponent', () => {
  let component: DialogApiErrorComponent;
  let fixture: ComponentFixture<DialogApiErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogApiErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogApiErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
