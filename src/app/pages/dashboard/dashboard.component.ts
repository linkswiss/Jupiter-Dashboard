import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {AppConfigService} from '../../services/app-config/app-config.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {AvailabilityInputCustomData, BaseConnectorSettings, EH2HConnectorCode} from '../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  connectors: BaseConnectorSettings[][];

  constructor(public appConfigService: AppConfigService) {
  }

  ngOnInit(): void {
    if (this.appConfigService.jupiterRemoteAppSettings) {
      let grouped = _.groupBy(this.appConfigService.jupiterRemoteAppSettings.Connectors.ConnectorSettings, function (c: BaseConnectorSettings) {
        return c.ConnectorCode;
      });
      this.connectors = _.map(grouped, function (c) {
        return c;
      });
    }
  }

}
