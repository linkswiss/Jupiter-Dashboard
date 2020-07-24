import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaxListDetailsComponent } from './pax-list-details.component';

describe('PaxListDetailsComponent', () => {
  let component: PaxListDetailsComponent;
  let fixture: ComponentFixture<PaxListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaxListDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaxListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
