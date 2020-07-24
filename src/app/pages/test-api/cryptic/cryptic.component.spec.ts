import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrypticComponent } from './cryptic.component';

describe('CrypticComponent', () => {
  let component: CrypticComponent;
  let fixture: ComponentFixture<CrypticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrypticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrypticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
