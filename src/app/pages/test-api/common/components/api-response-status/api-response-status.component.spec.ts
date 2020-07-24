import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiResponseStatusComponent } from './api-response-status.component';

describe('ApiResponseStatusComponent', () => {
  let component: ApiResponseStatusComponent;
  let fixture: ComponentFixture<ApiResponseStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiResponseStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiResponseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
