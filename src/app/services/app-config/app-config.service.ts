import {HttpClient} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserService} from '../user/user.service';
import * as _ from 'lodash';
import {EH2HConnectorCode, EH2HOperation} from '../jupiter-api/jupiter-api-client';
import {Title} from '@angular/platform-browser';

const {version: appVersion} = require('../../../../package.json');

import * as ElectronStore from 'electron-store';
import {UserSettings, Endpoint} from './user-settings.model';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AppSettings, IAppSettings} from "../dashboard-api/dashboard-api-client";


export function tokenGetter() {
  let currentUserStored = localStorage.getItem('currentUser');
  if (currentUserStored) {
    let currentUser = JSON.parse(currentUserStored);
    return currentUser ? currentUser.Token : null;
  } else {
    return null;
  }
}

export function jwtOptionsFactory(options) {
  let whitelist = options.whitelistedDomains || [];
  let blacklist = options.blacklistedRoutes || [];

  function addToDomainWhitelist(domain) {
    if (!whitelist.includes(domain)) {
      whitelist.push(domain);
    }
  }

  function addToDomainBlacklist(domain) {
    if (!blacklist.includes(domain)) {
      blacklist.push(domain);
    }
  }

  return {
    addToDomainWhitelist,
    addToDomainBlacklist,
    options: () => ({
      ...options,
      whitelistedDomains: whitelist,
      blacklistedRoutes: blacklist
    }),
  };
}


export const jwtOptions = jwtOptionsFactory({
  tokenGetter,
  whitelistedDomains: [],
  blacklistedRoutes: []
});


@Injectable({
  providedIn: 'root',
})
export class AppConfigService implements OnInit {
  defaultEndpoint: Endpoint;
  baseCurrentUrl = `https://${window.location.host}`;
  config: any;

  // jupiterRemoteAppSettings: AppSettings = null;
  jupiterRemoteAppSettings: IAppSettings = null;

  store: ElectronStore<UserSettings>;
  userAgent = navigator.userAgent.toLowerCase();

  constructor(private httpClient: HttpClient, private router: Router, public jwtHelper: JwtHelperService) {
    this.store = new ElectronStore<UserSettings>({
      defaults: {
        Endpoints: []
      }
    });
    this.loadDefaultEndpoint();
  }

  ngOnInit(): void {
  }

  loadDefaultEndpoint() {
    if (this.userAgent.indexOf(' electron/') > -1) {
      let endpoints = this.store.get('Endpoints');

      if (!endpoints || endpoints.length === 0) {
        this.router.navigate(['/app/preferencies']);
      }

      this.defaultEndpoint = _.find(endpoints, 'Default');

      if (this.defaultEndpoint) {
        this.baseCurrentUrl = this.defaultEndpoint.Url;
      }
    } else {
      this.baseCurrentUrl = environment.jupiterBaseApiUrl;
    }
    this.loadConfig(this.baseCurrentUrl);
  }

  loadConfig(endpointUrl: string) {
    this.config = {
      name: 'Jupiter Admin',
      dashboardVersion: appVersion,
      defaultJupiterApiDocumentationUrl: `${endpointUrl}/${environment.jupiterDefaultApiVersion}${environment.jupiterApiDocumentationPath}`,
      defaultJupiterDashboardApiDocumentationUrl: `${endpointUrl}/${environment.jupiterDefaultDashboardApiVersion}${environment.jupiterApiDocumentationPath}`,
      defaultJupiterApiModelsDocumentationUrl: `${endpointUrl}/1.0-modelsjupiter${environment.jupiterApiDocumentationPath}`,
      defaultJupiterDashboardApiModelsDocumentationUrl: `${endpointUrl}/1.0-modelsdashboard${environment.jupiterApiDocumentationPath}`,
      dashboardApi: {
        baseApiUrl: endpointUrl,
        apiPath: environment.jupiterDashboardApiPath,
        defaultApiVersion: environment.jupiterDefaultDashboardApiVersion,
        defaultApiUrl: `${endpointUrl}${environment.jupiterDashboardApiPath}/${environment.jupiterDefaultDashboardApiVersion}`,
      },
      jupiterApi: {
        baseApiUrl: endpointUrl,
        apiPath: environment.jupiterApiPath,
        defaultApiVersion: environment.jupiterDefaultApiVersion,
        defaultApiUrl: `${endpointUrl}${environment.jupiterApiPath}/${environment.jupiterDefaultApiVersion}`,
      },
      environment: environment,
      // lang: 'en',
    };

    jwtOptions.addToDomainWhitelist(this.config.jupiterApi.baseApiUrl.replace('https://', '').replace('http://', ''));
    jwtOptions.addToDomainBlacklist(this.config.dashboardApi.defaultApiUrl + '/users/authenticate');
    jwtOptions.addToDomainBlacklist(this.config.dashboardApi.defaultApiUrl + '/users/refresh-token');
  }

  getEndpoints(): Endpoint[] {
    return this.store.get('Endpoints');
  }

  setEndpoint(endpoint: Endpoint) {
    let endpoints = this.store.get('Endpoints');

    if (endpoints.length === 0) {
      endpoint.Default = true;
    }

    endpoints.push(endpoint);
    this.store.set('Endpoints', endpoints);

    this.loadDefaultEndpoint();
  }

  setEndpointAsDefault(endpoint: Endpoint) {
    let endpoints = this.store.get('Endpoints');

    endpoints.forEach((e) => {
      e.Default = false;
      if (e.Url === endpoint.Url) {
        e.Default = true;
      }
    });

    this.store.set('Endpoints', endpoints);

    this.loadDefaultEndpoint();
  }

  deleteEndpoint(endpoint: Endpoint) {
    let endpoints = this.store.get('Endpoints');

    _.remove(endpoints, (n) => {
      return n.Url === endpoint.Url;
    });

    if (endpoint.Default && endpoints.length > 0) {
      endpoints[0].Default = true;
    }

    this.store.set('Endpoints', endpoints);
    this.loadDefaultEndpoint();
  }

  /**
   * Get the JupiterAppSettings from API
   */
  getJupiterRemoteAppSettings() {
    return new Observable(obs => {
      this.httpClient.get<AppSettings>(this.config.dashboardApi.defaultApiUrl + '/utility/jupiter-settings')
        .subscribe(appSettings => {
            this.jupiterRemoteAppSettings = appSettings;
            obs.next(appSettings);
          },
          error => {
            if (error.status === 401) {
              console.log('UnAuthorized on getJupiterRemoteAppSettings -> Redirect to Login');
              this.jupiterRemoteAppSettings = null;
              this.router.navigate(['auth/login']);
            } else {
              this.jupiterRemoteAppSettings = null;
              obs.error(error);
              console.log('Redirect to App Preferencies');
              this.router.navigate(['app/preferencies']);
            }
          });
    });
  }

  /**
   * Get the ApiName from API
   */
  getApiName(): Observable<string> {
    return new Observable(obs => {
      this.httpClient.get<string>(this.config.jupiterApi.defaultApiUrl + '/utility/api-name')
        // .pipe(share())
        .subscribe(apiName => {
            obs.next(apiName);
          },
          error => {
            obs.error(error);
          });
    });
  }

  /**
   * Check if any Hotel Connector is enabled
   */
  isAnyCrypticConnectorEnabled(): boolean {
    let connectors = _.filter(this.jupiterRemoteAppSettings.Connectors.ConnectorSettings, (c) => {
      return _.find(c['EnabledConnectorTypes'], (t) => {
        return t === 'SESSION_AND_CRYPTIC';
      });
    });

    return connectors && connectors.length > 0;
  }

  /**
   * Check if any Hotel Connector is enabled
   */
  isAnyHotelConnectorEnabled(): boolean {
    let connectors = _.filter(this.jupiterRemoteAppSettings.Connectors.ConnectorSettings, (c) => {
      return _.find(c['EnabledConnectorTypes'], (t) => {
        return t === 'HOTEL';
      });
    });

    return connectors && connectors.length > 0;
  }

  /**
   * Check if any Train Connector is enabled
   */
  isAnyTrainConnectorEnabled(): boolean {
    let connectors = _.filter(this.jupiterRemoteAppSettings.Connectors.ConnectorSettings, (c) => {
      return _.find(c['EnabledConnectorTypes'], (t) => {
        return t === 'TRAIN';
      });
    });

    return connectors && connectors.length > 0;
  }

  /**
   * Check if any Flight Connector is enabled
   */
  isAnyFlightConnectorEnabled(): boolean {
    let connectors = _.filter(this.jupiterRemoteAppSettings.Connectors.ConnectorSettings, (c) => {
      return _.find(c['EnabledConnectorTypes'], (t) => {
        return t === 'FLIGHT';
      });
    });

    return connectors && connectors.length > 0;
  }

  /**
   * Check if any Car Connector is enabled
   */
  isAnyCarConnectorEnabled(): boolean {
    let connectors = _.filter(this.jupiterRemoteAppSettings.Connectors.ConnectorSettings, (c) => {
      return _.find(c['EnabledConnectorTypes'], (t) => {
        return t === 'CAR';
      });
    });

    return connectors && connectors.length > 0;
  }

  /**
   * check if a connector is Enabled
   * @param connectorCode
   */
  isEnabledConnector(connectorCode: EH2HConnectorCode): boolean {
    if (this.jupiterRemoteAppSettings) {
      let includes = _.includes(this.jupiterRemoteAppSettings.Connectors.EnabledConnectors, connectorCode);
      return includes;
    } else {
      return false;
    }
  }

  /**
   * Get the list of EH2HConnectorCode that are enabled to an operation
   * @param connectorOperation
   */
  getConnectorsEnabledToOperation(connectorOperation: EH2HOperation): EH2HConnectorCode[] {
    if (this.jupiterRemoteAppSettings) {
      // Filter enabled
      let connectorsEnabled = _.filter(this.jupiterRemoteAppSettings.Connectors.ConnectorSettings, (m) => {
        if (_.includes(this.jupiterRemoteAppSettings.Connectors.EnabledConnectors, m.ConnectorCode) &&
          _.includes(m.EnabledOperations, connectorOperation)) {
          return m.ConnectorCode;
        }
      });

      // Get the codes
      let connectorCodes: EH2HConnectorCode[] = _.uniq(_.map(connectorsEnabled, (m) => {
        return m.ConnectorCode;
      }));

      return connectorCodes;
    } else {
      return [];
    }
  }

  /**
   * Check if a specific Connector is enabled to a specific Operation -> used for navigate to details or other operations
   * @param connectorCode
   * @param connectorOperation
   */
  isConnectorOperationEnabled(connectorCode: EH2HConnectorCode, connectorOperation: EH2HOperation): boolean {
    if (this.jupiterRemoteAppSettings) {
      let connectors = this.getConnectorsEnabledToOperation(connectorOperation);
      let includes = _.includes(connectors, connectorCode);
      return includes;
    } else {
      return false;
    }
  }
}
