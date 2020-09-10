import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfigService } from '../services/app-config/app-config.service';
import { UserService } from '../services/user/user.service';

// import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'jupiter-pages',
  template: `
    <jupiter-layout *ngIf="appConfigService.jupiterRemoteAppSettings">
      <jupiter-menu></jupiter-menu>
      <!--<nb-menu [items]="menu"></nb-menu>-->
      <router-outlet></router-outlet>
    </jupiter-layout>
  `,
})
export class PagesComponent implements OnInit {
  constructor(public appConfigService: AppConfigService) {
  }

  ngOnInit(): void {
    // INIT any service if needed
    this.appConfigService.getJupiterRemoteAppSettings().subscribe();
  }
}
