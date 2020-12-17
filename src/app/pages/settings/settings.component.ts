import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {$e} from 'codelyzer/angular/styles/chars';
import {AppConfigService} from '../../services/app-config/app-config.service';
import {DashboardApiService} from '../../services/dashboard-api/dashboard-api.service';
import {UserService} from '../../services/user/user.service';
import {CacheEntry, PublishedRoute, SingleCacheItem} from "../../services/dashboard-api/dashboard-api-client";
import {DialogApiErrorComponent} from "../test-api/common/components/dialog-api-error/dialog-api-error.component";
import {JupiterApiService} from "../../services/jupiter-api/jupiter-api.service";
import {NbDialogService} from "@nebular/theme";

@Component({
  selector: 'jupiter-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @ViewChild('methodTpl', {static: true}) public methodTpl: TemplateRef<any>;
  @ViewChild('authTpl', {static: true}) public authTpl: TemplateRef<any>;
  @ViewChild('cacheActionsTpl', {static: true}) public cacheActionsTpl: TemplateRef<any>;
  @ViewChild('cacheTypeTpl', {static: true}) public cacheTypeTpl: TemplateRef<any>;

  appSettingsJsonString = '';
  jupiterApiSettingsJsonString = '';
  // jupiterAppSettings: AppSettings = null;

  routesColumns = [];
  routesData: Array<PublishedRoute> = [];

  cacheEntriesColumns = [];
  cacheEntriesData: Array<CacheEntry> = [];
  cacheEntriesDefaultSort = [];
  cacheResult: SingleCacheItem = null;

  loadingTypescript = false;
  loadingCSharp = false;
  loadingDashboardTypescript = false;

  constructor(public appConfigService: AppConfigService,
              public userService: UserService,
              public jwtHelperService: JwtHelperService,
              private dashboardApiService: DashboardApiService,
              private jupiterApiService: JupiterApiService,
              private dialogService: NbDialogService
  ) {
    this.setAppSettingsJson();
  }

  ngOnInit() {
    this.routesColumns = [
      {prop: 'Method', maxWidth: 80, cellTemplate: this.methodTpl},
      {prop: 'Authorization', maxWidth: 200, cellTemplate: this.authTpl},
      // {prop: 'Path'},
      {prop: 'PathTemplate'},
      {prop: 'Invocation'},
    ];

    this.cacheEntriesColumns = [
      {prop: 'Actions', maxWidth: 100, cellTemplate: this.cacheActionsTpl},
      {prop: 'CachedItemType', name: 'Cached Item', cellTemplate: this.cacheTypeTpl},
      // {prop: 'CachedItemKey', name: 'Cached Item', cellTemplate: this.cacheKeyTpl},
      {prop: 'CachedItemSize', name: 'Size'},
      {prop: 'CachedDateTimeUtc', name: 'Created UTC'},
      {prop: 'ExpirationTimeSpan', name: 'Expiration'},
      {prop: 'ExpirationAbsoluteDateTimeUtc', name: 'Absolute Expiration UTC'},
    ];
    this.cacheEntriesDefaultSort = [
      {
        prop: 'CachedDateTimeUtc',
        dir: 'desc'
      }
    ];

  }

  isEnabledConnector(connectorCode) {
    return this.appConfigService.jupiterRemoteAppSettings.Connectors.EnabledConnectors.indexOf(connectorCode) > -1;
  }

  changeTab($event) {
    switch ($event.tabTitle) {
      case 'Published Routes':
        this.getPublishedRoutes();
        break;
      case 'Remote Cache':
        this.getCacheEntries();
        break;
    }
    // console.log($event);
  }

  setAppSettingsJson() {
    this.appSettingsJsonString = JSON.stringify(this.appConfigService.config, null, 2);
    this.jupiterApiSettingsJsonString = JSON.stringify(this.appConfigService.jupiterRemoteAppSettings, null, 2);
  }

  // refreshRemoteSettings() {
  //   this.jupiterApiSettingsJsonString = '';
  //
  //   this.appConfigService.getJupiterRemoteAppSettings()
  //       .subscribe(appSettings => {
  //           this.jupiterAppSettings = appSettings;
  //           this.jupiterApiSettingsJsonString = JSON.stringify(appSettings, null, 2);
  //         },
  //         error => {
  //           console.log(error);
  //           this.jupiterApiSettingsJsonString = 'Error call Remote';
  //         });
  //   // this.jupiterApiSettingsJsonString = JSON.stringify(this.appConfigService.getJupiterRemoteAppSettings(), null, 2);
  //   this.appSettingsJsonString = JSON.stringify(this.appConfigService.config, null, 2);
  // }

  getPublishedRoutes() {
    this.dashboardApiService.getPublishedRoutes().subscribe(publishedRoutes => {
      this.routesData = publishedRoutes;
    }, error => {
      console.error(error);
    });
  }

  getCacheEntries() {
    this.dashboardApiService.getCacheEntries().subscribe(cacheEntries => {
      this.cacheEntriesData = cacheEntries;
    }, error => {
      console.error(error);
    });
  }

  clearCache() {
    this.dashboardApiService.clearCache().subscribe(cacheEntries => {
      this.cacheEntriesData = cacheEntries;
    }, error => {
      console.error(error);
    });
  }

  getSingleCacheItem(cacheEntry: CacheEntry) {
    this.dashboardApiService.getSingleCacheItem(cacheEntry.CachedItemKey).subscribe(cacheItem => {
      this.cacheResult = cacheItem;
      //Format the data
      if(this.cacheResult.CacheItemJson){
        let parsed = JSON.parse(this.cacheResult.CacheItemJson);
        this.cacheResult.CacheItemJson = JSON.stringify(parsed, null, 2);
      }
    }, error => {
      console.error(error);
    });
  }

  clearSingleCacheItem(cacheEntry: CacheEntry) {
    this.dashboardApiService.clearSingleCacheItem(cacheEntry.CachedItemKey).subscribe(cacheEntries => {
      this.cacheEntriesData = cacheEntries;
    }, error => {
      console.error(error);
    });
  }

  getJsonObject(object: any): string {
    return JSON.stringify(object, null, 2);
  }

  downloadTypescriptClient() {
    this.loadingTypescript = true;
    this.jupiterApiService.downloadJupiterApiTypescriptClient().subscribe(response => {
      this.loadingTypescript = false;
      console.log('download completed');
    }, error => {
      this.loadingTypescript = false;
      console.error(error);
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'Download JupiterApi TypescriptClient Error',
          error: error
        },
      });
    });
  }

  downloadCSharpClient() {
    this.loadingCSharp = true;
    this.jupiterApiService.downloadJupiterApiCSharpClient().subscribe(response => {
      this.loadingCSharp = false;
      console.log('download completed');
    }, error => {
      this.loadingCSharp = false;
      console.error(error);
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'Download JupiterApi CSharpClient Error',
          error: error
        },
      });
    });
  }

  downloadDashboardTypescriptClient() {
    this.loadingDashboardTypescript = true;
    this.dashboardApiService.downloadJupiterApiTypescriptClient().subscribe(response => {
      this.loadingDashboardTypescript = false;
      console.log('download completed');
    }, error => {
      this.loadingDashboardTypescript = false;
      console.error(error);
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'Download JupiterApi Dashboard TypescriptClient Error',
          error: error
        },
      });
    });
  }
}
