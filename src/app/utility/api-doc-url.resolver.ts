import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AppConfigService } from '../services/app-config/app-config.service';

@Injectable()
export class ApiDocUrlResolver implements Resolve<any> {
  constructor(private appConfigService: AppConfigService) {
  }

  resolve(route: ActivatedRouteSnapshot) {

    let frag = route.routeConfig.path;
    let apiDocUrl = '';

    switch (frag) {
      case 'dashboard-api-documentation':
        apiDocUrl = this.appConfigService.config.defaultJupiterDashboardApiDocumentationUrl;
        break;
      case 'api-documentation':
        apiDocUrl = this.appConfigService.config.defaultJupiterApiDocumentationUrl;
        break;
      case 'dashboard-models-documentation':
        apiDocUrl = this.appConfigService.config.defaultJupiterDashboardApiModelsDocumentationUrl;
        break;
      case 'api-models-documentation':
        apiDocUrl = this.appConfigService.config.defaultJupiterApiModelsDocumentationUrl;
        break;
    }

    return apiDocUrl;
  }
}
