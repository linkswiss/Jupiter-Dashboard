import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiMessagesAccordionComponent } from './api-messages-accordion.component';

describe('ApiMessagesAccordionComponent', () => {
  let component: ApiMessagesAccordionComponent;
  let fixture: ComponentFixture<ApiMessagesAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiMessagesAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiMessagesAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
