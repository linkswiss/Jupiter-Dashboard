import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {AppConfigService} from '../../../../../services/app-config/app-config.service';
import {BaseConnectorSettings, ConnectorEnvironment, EH2HConnectorCode} from '../../../../../services/jupiter-api/jupiter-api-client';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';

@Component({
  selector: 'jupiter-connectors-environment',
  templateUrl: './connectors-environment.component.html',
  styleUrls: ['./connectors-environment.component.scss']
})
export class ConnectorsEnvironmentComponent implements OnInit, OnChanges {
  @Input() FilterConnectors: EH2HConnectorCode[];
  @Input() ConnectorsEnvironment: ConnectorEnvironment[];
  @Output() ConnectorsEnvironmentChange = new EventEmitter();

  public connectors: ConnectorEnvironment[] = [];
  public selectedConnectorsEnv: number[] = [];

  constructor(public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    let enabledConnectors = _.filter(this.appConfigService.jupiterRemoteAppSettings.Connectors.ConnectorSettings, (m) => {
      if (_.includes(this.appConfigService.jupiterRemoteAppSettings.Connectors.EnabledConnectors, m.ConnectorCode)) {
        if(!this.FilterConnectors || this.FilterConnectors.length == 0 || _.includes(this.FilterConnectors, m.ConnectorCode)){
          return m;
        }
      }
    });

    this.connectors = _.map(enabledConnectors, function (c) {
      return new ConnectorEnvironment({
        ConnectorCode: c.ConnectorCode,
        Environment: c.Environment
      });
    });

    this.setSelected();
  }

  setSelected() {
    this.selectedConnectorsEnv = [];
    if (this.ConnectorsEnvironment && this.ConnectorsEnvironment.length > 0) {
      for (let i = 0; i < this.connectors.length; i++) {
        let connector = this.connectors[i];
        let findConnector = _.find(this.ConnectorsEnvironment, function (c: ConnectorEnvironment) {
          return c.ConnectorCode === connector.ConnectorCode && c.Environment === connector.Environment;
        });
        if (findConnector) {
          this.selectedConnectorsEnv.push(i);
        }
      }
    }
  }

  ngOnChanges() {
    let enabledConnectors = _.filter(this.appConfigService.jupiterRemoteAppSettings.Connectors.ConnectorSettings, (m) => {
      if (_.includes(this.appConfigService.jupiterRemoteAppSettings.Connectors.EnabledConnectors, m.ConnectorCode)) {
        if(!this.FilterConnectors || this.FilterConnectors.length == 0 || _.includes(this.FilterConnectors, m.ConnectorCode)){
          return m;
        }
      }
    });

    this.connectors = _.map(enabledConnectors, function (c) {
      return new ConnectorEnvironment({
        ConnectorCode: c.ConnectorCode,
        Environment: c.Environment
      });
    });

    this.setSelected();
  }

  connectorEnvChanged(value: number[]) {
    this.ConnectorsEnvironment = [];
    for (const index of value) {
      this.ConnectorsEnvironment.push(this.connectors[index]);
    }

    // this.ConnectorsEnvironment = value;
    // for (const baseConnectorSetting of value) {
    //   this.ConnectorsEnvironment.push(new ConnectorEnvironment({
    //     ConnectorCode: baseConnectorSetting.ConnectorCode,
    //     Environment: baseConnectorSetting.Environment
    //   }));
    // }

    this.ConnectorsEnvironmentChange.emit(this.ConnectorsEnvironment);
  }

}
