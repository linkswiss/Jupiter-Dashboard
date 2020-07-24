import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KibanaComponent } from './kibana.component';

describe('KibanaComponent', () => {
  let component: KibanaComponent;
  let fixture: ComponentFixture<KibanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KibanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KibanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
