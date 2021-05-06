import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  AmadeusFlightQueueListInputCustomData,
  ConnectorEnvironment,
  EH2HConnectorCode,
  EH2HOperation,
  FlightQueuePnr,
  JupiterFlightAvailabilityRQ,
  JupiterFlightAvailabilityRS, JupiterFlightBookRQ, JupiterFlightBookRS,
  JupiterFlightDetailRQ,
  JupiterFlightDetailRS,
  JupiterFlightPnrRetrieveInput,
  JupiterFlightPnrRetrieveRQ,
  JupiterFlightPnrRetrieveRS,
  JupiterFlightQueueListInput,
  JupiterFlightQueueListRQ,
  JupiterFlightQueueListRS,
  JupiterFlightQueueRemovePnrInput,
  JupiterFlightQueueRemovePnrRQ,
  JupiterFlightQueueRemovePnrRS
} from "../../../../services/jupiter-api/jupiter-api-client";
import {JupiterApiService} from "../../../../services/jupiter-api/jupiter-api.service";
import {AppConfigService} from "../../../../services/app-config/app-config.service";

@Component({
  selector: 'app-flight-queue-list',
  templateUrl: './flight-queue-list.component.html',
  styleUrls: ['./flight-queue-list.component.scss']
})
export class FlightQueueListComponent implements OnInit {
  loading = false;
  columns = [];

  jupiterFlightQueueListRq: JupiterFlightQueueListRQ = null;
  jupiterFlightQueueListRs: JupiterFlightQueueListRS = null;

  jupiterFlightQueueRemovePnrRq: JupiterFlightQueueRemovePnrRQ = null;
  jupiterFlightQueueRemovePnrRs: JupiterFlightQueueRemovePnrRS = null;

  flightQueueSelectedResults: FlightQueuePnr[] = null;

  jupiterFlightPnrRetrieveRq: JupiterFlightPnrRetrieveRQ = null;
  jupiterFlightPnrRetrieveRs: JupiterFlightPnrRetrieveRS = null;

  selectedConnector: EH2HConnectorCode = EH2HConnectorCode.SABRE;
  selectedConnectorsDebug: EH2HConnectorCode[] = [];
  connectors: EH2HConnectorCode[] = null;
  connectorsEnvironment: ConnectorEnvironment[] = [];

  constructor(private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) { }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.FLIGHT_QUEUE_LIST);
    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){
      switch (this.jupiterApiService.selectedLogMethod) {
        case EH2HOperation.FLIGHT_QUEUE_LIST:
          this.jupiterFlightQueueListRq = JupiterFlightQueueListRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
          this.jupiterFlightQueueListRs = JupiterFlightQueueListRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
          this.jupiterApiService.selectedLogMethod = null;
          this.jupiterApiService.selectedLogRqJson = null;
          this.jupiterApiService.selectedLogRsJson = null;
          break;
        case EH2HOperation.FLIGHT_QUEUE_REMOVE_PNR:
          this.jupiterFlightQueueRemovePnrRq = JupiterFlightQueueRemovePnrRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
          this.jupiterFlightQueueRemovePnrRs = JupiterFlightQueueRemovePnrRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
          this.jupiterApiService.selectedLogMethod = null;
          this.jupiterApiService.selectedLogRqJson = null;
          this.jupiterApiService.selectedLogRsJson = null;
          break;
      }
    }else {
      this.jupiterFlightQueueListRq = new JupiterFlightQueueListRQ({
        ConnectorsEnvironment: this.connectorsEnvironment,
        Request: new JupiterFlightQueueListInput({
          ConnectorsDebug: [],
          ConnectorCode: null,
          ConnectorCustomData: null,
          QueueNumber: '',
        })
      });
    }
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  handleConnectorsChanged(connector: EH2HConnectorCode) {
    this.jupiterFlightQueueListRq.Request.ConnectorCustomData = null;
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
        this.jupiterFlightQueueListRq.Request.ConnectorCustomData = new AmadeusFlightQueueListInputCustomData({
          Category: ""
        });
        // this.jupiterFlightPnrRetrieveRq.Request.PnrNumber = '';
        break;
    }
  }

  queueList() {
    this.loading = true;

    this.resetSelected();

    this.jupiterApiService.flightQueueList(this.jupiterFlightQueueListRq).subscribe(response => {
      this.jupiterFlightQueueListRs = response;
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  resetSelected(){
    this.flightQueueSelectedResults = null;

    this.jupiterFlightPnrRetrieveRq = null;
    this.jupiterFlightPnrRetrieveRs = null;

    this.jupiterFlightQueueRemovePnrRq = null;
    this.jupiterFlightQueueRemovePnrRs = null;
  }

  queueRemovePnr(flightQueuePnr: FlightQueuePnr) {
    this.loading = true;

    this.jupiterFlightQueueRemovePnrRq = new JupiterFlightQueueRemovePnrRQ({
      ConnectorsEnvironment: this.jupiterFlightPnrRetrieveRq.ConnectorsEnvironment,
      Request: new JupiterFlightQueueRemovePnrInput({
        QueueNumber: this.jupiterFlightQueueListRs.Response.QueueNumber,
        ConnectorsDebug: this.jupiterFlightQueueListRq.Request.ConnectorsDebug,
        ConnectorCode: this.jupiterFlightQueueListRs.Response.ConnectorCode,
        ConnectorCustomData: null,
        PnrNumber: flightQueuePnr.PnrNumber,
      })
    });

    this.jupiterApiService.flightQueueRemovePnr(this.jupiterFlightQueueRemovePnrRq).subscribe(response => {
      this.jupiterFlightQueueRemovePnrRs = response;
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  retrievePnr(flightQueuePnr: FlightQueuePnr) {
    // this.loading = true;

    this.flightQueueSelectedResults = [flightQueuePnr];

    this.jupiterFlightPnrRetrieveRq = new JupiterFlightPnrRetrieveRQ({
      ConnectorsEnvironment: this.jupiterFlightQueueListRq.ConnectorsEnvironment,
      Request: new JupiterFlightPnrRetrieveInput({
        ConnectorsDebug: this.jupiterFlightQueueListRq.Request.ConnectorsDebug,
        ConnectorCode: this.jupiterFlightQueueListRs.Response.ConnectorCode,
        ConnectorCustomData: null,
        PnrNumber: flightQueuePnr.PnrNumber,
      })
    });

    // this.jupiterApiService.flightPnrRetrieve(this.jupiterFlightPnrRetrieveRq).subscribe(response => {
    //   this.jupiterFlightPnrRetrieveRs = response;
    //   this.loading = false;
    // }, error => {
    //   console.error(error);
    //   this.loading = false;
    // });
  }

}
