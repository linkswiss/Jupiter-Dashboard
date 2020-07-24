import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AppConfigService } from '../services/app-config/app-config.service';

@Injectable()
export class KibanaUrlResolver implements Resolve<any> {
  constructor(private appConfigService: AppConfigService) {
  }

  async resolve(route: ActivatedRouteSnapshot) {

    let frag = route.routeConfig.path;
    let kibanaUrl = '';
    let elasticSearchSettingsKey = '';

    // await this.appConfigService.getJupiterRemoteAppSettings();
    switch (frag) {
      case 'dashboard':
        elasticSearchSettingsKey = 'KibanaMainDashboardIframeUrl';
        // kibanaUrl = this.appConfigService.jupiterRemoteAppSettings.ElasticSearchSettings.KibanaMainDashboardIframeUrl;
        break;
      case 'kibana':
        elasticSearchSettingsKey = 'KibanaUrl';
        // kibanaUrl = this.appConfigService.jupiterRemoteAppSettings.ElasticSearchSettings.KibanaUrl;
        break;
      case 'kibana-logs':
        elasticSearchSettingsKey = 'KibanaLogsDashboardIframeUrl';
        // kibanaUrl = this.appConfigService.jupiterRemoteAppSettings.ElasticSearchSettings.KibanaLogsDashboardIframeUrl;
        break;
    }

    // return kibanaUrl;
    return elasticSearchSettingsKey;


    // (result => {
    //   switch (frag) {
    //     case 'dashboard':
    //       kibanaUrl = this.appConfigService.jupiterRemoteAppSettings.ElasticSearchSettings.KibanaMainDashboardIframeUrl;
    //       break;
    //     case 'kibana':
    //       kibanaUrl = this.appConfigService.jupiterRemoteAppSettings.ElasticSearchSettings.KibanaUrl;
    //       break;
    //     case 'kibana-logs':
    //       kibanaUrl = this.appConfigService.jupiterRemoteAppSettings.ElasticSearchSettings.KibanaLogsDashboardIframeUrl;
    //       break;
    //   }
    //
    //   return kibanaUrl;
    // });

  }
}
