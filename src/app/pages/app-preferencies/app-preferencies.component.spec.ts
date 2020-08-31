/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppPreferenciesComponent } from './app-preferencies.component';

describe('AppPreferenciesComponent', () => {
  let component: AppPreferenciesComponent;
  let fixture: ComponentFixture<AppPreferenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPreferenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPreferenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
