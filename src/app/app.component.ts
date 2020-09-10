import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {AppConfigService} from './services/app-config/app-config.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import * as WebFont from 'webfontloader';

@Component({
  selector: 'jupiter-app',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  public constructor(private titleService: Title, public appConfigService: AppConfigService) {
    WebFont.load({
      google: {
          families: ['Exo', 'Roboto']
      }
  });

    this.appConfigService.getApiName().subscribe(apiName => {
      this.setTitle(apiName);
    });
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(`Jupiter Admin - ${newTitle}`);
  }
}
