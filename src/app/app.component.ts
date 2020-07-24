import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {AppConfigService} from './services/app-config/app-config.service';
import {UserAuthRQ} from './api/dashboard/model/userAuthRQ';
import {Observable} from 'rxjs';
import {User} from './api/dashboard/model/user';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'jupiter-app',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  public constructor(private titleService: Title, public appConfigService: AppConfigService) {
    this.appConfigService.getApiName().subscribe(apiName => {
      this.setTitle(apiName);
    });
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(`Jupiter Admin - ${newTitle}`);
  }
}
