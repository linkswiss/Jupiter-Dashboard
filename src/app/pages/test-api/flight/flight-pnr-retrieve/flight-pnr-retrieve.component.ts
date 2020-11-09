import {Component, OnInit} from '@angular/core';
import {
  ConnectorEnvironment,
  EFlightCabin,
  EH2HConnectorCode,
  EH2HOperation,
  FlightFareGroupResult,
  JupiterFlightAvailabilityInput,
  JupiterFlightAvailabilityRQ,
  JupiterFlightAvailabilityRS,
  JupiterFlightDetailInput,
  JupiterFlightDetailRQ,
  JupiterFlightDetailRS,
  JupiterFlightPnrDeleteInput,
  JupiterFlightPnrDeleteRQ,
  JupiterFlightPnrDeleteRS,
  JupiterFlightPnrRetrieveInput,
  JupiterFlightPnrRetrieveRQ,
  JupiterFlightPnrRetrieveRS,
  SabreFlightPnrCustomData,
  SabreFlightRetrievePnrCustomData,
  SingleFlightAvailResult
} from '../../../../services/jupiter-api/jupiter-api-client';
import * as moment from 'moment';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {FlightStepRequestFormModel} from '../flight-search/flight-search.component';
import {AppConfigService} from '../../../../services/app-config/app-config.service';

@Component({
  selector: 'jupiter-flight-pnr-retrieve',
  templateUrl: './flight-pnr-retrieve.component.html',
  styleUrls: ['./flight-pnr-retrieve.component.scss']
})
export class FlightPnrRetrieveComponent implements OnInit {
  loading = false;

  jupiterFlightPnrRetrieveRq: JupiterFlightPnrRetrieveRQ = null;
  jupiterFlightPnrRetrieveRs: JupiterFlightPnrRetrieveRS = null;

  jupiterFlightPnrDeleteRq: JupiterFlightPnrDeleteRQ = null;
  jupiterFlightPnrDeleteRs: JupiterFlightPnrDeleteRS = null;

  pnrNumber = '';

  selectedConnector: EH2HConnectorCode = EH2HConnectorCode.SABRE;
  selectedConnectorsDebug: EH2HConnectorCode[] = [];
  connectors: EH2HConnectorCode[] = null;
  connectorsEnvironment: ConnectorEnvironment[] = [];

  constructor(private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {

  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.FLIGHT_PNR_RETRIEVE);

    this.jupiterFlightPnrRetrieveRq = new JupiterFlightPnrRetrieveRQ({
      ConnectorsEnvironment: this.connectorsEnvironment,
      Request: new JupiterFlightPnrRetrieveInput({
        ConnectorsDebug: [],
        ConnectorCode: null,
        ConnectorCustomData: null,
        PnrNumber: '',
      })
    });

    // Sample SABRE CERT
    // TRWXLH
    // CWHVAV
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  handleConnectorsChanged(connector: EH2HConnectorCode) {
    switch (connector) {
      case EH2HConnectorCode.SABRE:
        // this.jupiterFlightPnrRetrieveRq.Request.ConnectorCustomData = new SabreFlightRetrievePnrCustomData({
        //   PnrCustomData: new SabreFlightPnrCustomData({
        //     CustomerIdentifierDk: null,
        //     ReceivedFrom: null,
        //   }),
        // });
        break;
      case EH2HConnectorCode.AMADEUS:
        // this.jupiterFlightPnrRetrieveRq.Request.PnrNumber = '';
        break;
    }
  }

  retrievePnr() {
    this.loading = true;

    this.jupiterFlightPnrDeleteRq = null;
    this.jupiterFlightPnrDeleteRs = null;

    this.jupiterApiService.flightPnrRetrieve(this.jupiterFlightPnrRetrieveRq).subscribe(response => {
      this.jupiterFlightPnrRetrieveRs = response;
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });

  }

  deletePnr(){
    this.jupiterFlightPnrDeleteRq = new JupiterFlightPnrDeleteRQ({
      ConnectorsEnvironment: this.jupiterFlightPnrRetrieveRq.ConnectorsEnvironment,
      Request: new JupiterFlightPnrDeleteInput({
        PnrNumber: this.jupiterFlightPnrRetrieveRs.Response.Pnr.PnrNumber,
        ConnectorCode: this.jupiterFlightPnrRetrieveRs.Response.Pnr.ConnectorCode,
        ConnectorsDebug: this.selectedConnectorsDebug
      })
    });

    this.jupiterApiService.flightPnrDelete(this.jupiterFlightPnrDeleteRq).subscribe(response => {
      this.jupiterFlightPnrDeleteRs = response;
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });

  }
}
