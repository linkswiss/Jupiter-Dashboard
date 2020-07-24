import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SabreSessionPoolComponent } from './sabre-session-pool.component';

describe('SabreSessionPoolComponent', () => {
  let component: SabreSessionPoolComponent;
  let fixture: ComponentFixture<SabreSessionPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SabreSessionPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SabreSessionPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
