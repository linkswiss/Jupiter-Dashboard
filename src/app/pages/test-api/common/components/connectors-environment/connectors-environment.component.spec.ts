import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorsEnvironmentComponent } from './connectors-environment.component';

describe('ConnectorsEnvironmentComponent', () => {
  let component: ConnectorsEnvironmentComponent;
  let fixture: ComponentFixture<ConnectorsEnvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectorsEnvironmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorsEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
