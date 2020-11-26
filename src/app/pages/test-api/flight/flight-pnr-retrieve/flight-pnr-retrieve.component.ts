import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {
  AmadeusFlightQueuePlacePnrInputCustomData,
  ConnectorEnvironment,
  EH2HConnectorCode,
  EH2HOperation,
  JupiterFlightPnrDeleteInput,
  JupiterFlightPnrDeleteRQ,
  JupiterFlightPnrDeleteRS,
  JupiterFlightPnrRetrieveInput,
  JupiterFlightPnrRetrieveRQ,
  JupiterFlightPnrRetrieveRS,
  JupiterFlightQueuePlacePnrInput,
  JupiterFlightQueuePlacePnrRQ,
  JupiterFlightQueuePlacePnrRS
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';

@Component({
  selector: 'jupiter-flight-pnr-retrieve',
  templateUrl: './flight-pnr-retrieve.component.html',
  styleUrls: ['./flight-pnr-retrieve.component.scss']
})
export class FlightPnrRetrieveComponent implements OnInit, OnChanges {
  @Input() jupiterFlightPnrRetrieveRq: JupiterFlightPnrRetrieveRQ = null;

  showRqForm = true;
  loading = false;

  // jupiterFlightPnrRetrieveRq: JupiterFlightPnrRetrieveRQ = null;
  jupiterFlightPnrRetrieveRs: JupiterFlightPnrRetrieveRS = null;

  jupiterFlightPnrDeleteRq: JupiterFlightPnrDeleteRQ = null;
  jupiterFlightPnrDeleteRs: JupiterFlightPnrDeleteRS = null;

  jupiterFlightQueuePlacePnrRq: JupiterFlightQueuePlacePnrRQ = null;
  jupiterFlightQueuePlacePnrRs: JupiterFlightQueuePlacePnrRS = null;

  queueNumber = '';

  pnrNumber = '';

  selectedConnector: EH2HConnectorCode = EH2HConnectorCode.SABRE;
  selectedConnectorsDebug: EH2HConnectorCode[] = [];
  connectors: EH2HConnectorCode[] = null;
  connectorsEnvironment: ConnectorEnvironment[] = [];
  EH2HConnectorCode = EH2HConnectorCode;

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
  }

  ngOnChanges() {
    if(!this.jupiterFlightPnrRetrieveRq){
      this.showRqForm = true;
      this.jupiterFlightPnrRetrieveRq = new JupiterFlightPnrRetrieveRQ({
        ConnectorsEnvironment: this.connectorsEnvironment,
        Request: new JupiterFlightPnrRetrieveInput({
          ConnectorsDebug: [],
          ConnectorCode: null,
          ConnectorCustomData: null,
          PnrNumber: '',
        })
      });
    }else{
      this.showRqForm = false;
      this.retrievePnr();
    }
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

  queuePlacePnr() {
    this.loading = true;

    this.jupiterFlightQueuePlacePnrRq = new JupiterFlightQueuePlacePnrRQ({
      ConnectorsEnvironment: this.jupiterFlightPnrRetrieveRq.ConnectorsEnvironment,
      Request: new JupiterFlightQueuePlacePnrInput({
        ConnectorsDebug: this.jupiterFlightPnrRetrieveRq.Request.ConnectorsDebug,
        ConnectorCode: this.jupiterFlightPnrRetrieveRs.Response.Pnr.ConnectorCode,
        ConnectorCustomData: null,
        PnrNumber: this.jupiterFlightPnrRetrieveRs.Response.Pnr.PnrNumber,
        QueueNumber: this.queueNumber,
      })
    });

    // // If AMADEUS Add ConnectorCustomData with the targetOffice Required
    // if(this.jupiterFlightQueuePlacePnrRq.Request.ConnectorCode == EH2HConnectorCode.AMADEUS){
    //   this.jupiterFlightQueuePlacePnrRq.Request.ConnectorCustomData = new AmadeusFlightQueuePlacePnrInputCustomData({
    //     TargetOffice: '',
    //     Category: ''
    //   });
    // }

    this.jupiterApiService.flightQueuePlacePnr(this.jupiterFlightQueuePlacePnrRq).subscribe(response => {
      this.jupiterFlightQueuePlacePnrRs = response;
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  deletePnr(){
    this.loading = true;

    this.jupiterFlightPnrDeleteRq = new JupiterFlightPnrDeleteRQ({
      ConnectorsEnvironment: this.jupiterFlightPnrRetrieveRq.ConnectorsEnvironment,
      Request: new JupiterFlightPnrDeleteInput({
        PnrNumber: this.jupiterFlightPnrRetrieveRs.Response.Pnr.PnrNumber,
        ConnectorCode: this.jupiterFlightPnrRetrieveRs.Response.Pnr.ConnectorCode,
        ConnectorsDebug: this.jupiterFlightPnrRetrieveRq.Request.ConnectorsDebug
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
