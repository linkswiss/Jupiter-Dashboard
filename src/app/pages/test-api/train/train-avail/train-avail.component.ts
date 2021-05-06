import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import Utils from "../../../../utility/utils";
import {
  AmadeusFlightAvailabilityInputCustomData,
  AmadeusFlightStepRequestCustomData,
  AvailabilityInputCustomData,
  EH2HConnectorCode,
  EH2HOperation,
  EmindsTrainAvailabilityInputCustomData,
  EmindsTrainStepRequestCustomData,
  ETripType,
  FlightStepRequest,
  JupiterFlightAvailabilityInput,
  JupiterFlightAvailabilityRQ,
  JupiterFlightAvailabilityRS,
  JupiterSingleHotelAvailabilityRQ,
  JupiterTrainAvailabilityInput,
  JupiterTrainAvailabilityRQ,
  JupiterTrainAvailabilityRS,
  SabreFlightAvailabilityInputCustomData,
  SabreFlightStepRequestCustomData,
  SingleFlightAvailResult,
  SingleTrainAvailResult,
  TrainStepRequest,
  TrainStepRequestCustomData,
  TravelFusionFlightStepRequestCustomData
} from "../../../../services/jupiter-api/jupiter-api-client";
import {DialogApiErrorComponent} from "../../common/components/dialog-api-error/dialog-api-error.component";
import {NbAccordionItemComponent, NbDialogService} from "@nebular/theme";
import {JupiterApiService} from "../../../../services/jupiter-api/jupiter-api.service";
import {AppConfigService} from "../../../../services/app-config/app-config.service";
import * as moment from "moment";
import {CustomDataInputSettings} from "../../common/components/custom-data-inputs/custom-data-inputs.component";

@Component({
  selector: 'jupiter-train-avail',
  templateUrl: './train-avail.component.html',
  styleUrls: ['./train-avail.component.scss']
})
export class TrainAvailComponent implements OnInit {

  @ViewChild('accordionItemRq', {static: true}) accordionItemRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;

  jupiterTrainAvailabilityRq: JupiterTrainAvailabilityRQ = null;
  jupiterTrainAvailabilityRs: JupiterTrainAvailabilityRS = null;

  connectors: EH2HConnectorCode[] = null;
  viewPortItems: SingleTrainAvailResult[];

  constructor(private dialogService: NbDialogService, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) { }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.TRAIN_AVAIL);
    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){
      this.jupiterTrainAvailabilityRq = JupiterTrainAvailabilityRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
      this.jupiterTrainAvailabilityRs = JupiterTrainAvailabilityRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
      this.jupiterApiService.selectedLogMethod = null;
      this.jupiterApiService.selectedLogRqJson = null;
      this.jupiterApiService.selectedLogRsJson = null;
    }else {
      this.jupiterTrainAvailabilityRq = new JupiterTrainAvailabilityRQ({
        ForceNotCachedResponse: true,
        ConnectorsEnvironment: [],
        Request: new JupiterTrainAvailabilityInput({
          ConnectorsDebug: [],
          ConnectorsSearch: [],
          AdultCount: 2,
          ChildCount: 0,
          InfantCount: 0,
          ConnectorCustomData: [],
          TrainSteps: [],
        })
      });

      // Add 1 step
      this.addStep();
    }

  }

  /**
   * Add Train Step to Request
   */
  addStep() {
    let departureDate = moment();
    let departureStation = '';
    if (this.jupiterTrainAvailabilityRq.Request.TrainSteps.length > 0) {
      departureDate = moment(this.jupiterTrainAvailabilityRq.Request.TrainSteps[this.jupiterTrainAvailabilityRq.Request.TrainSteps.length - 1].DepartureDate).add(1, 'days');

      //this.jupiterTrainAvailabilityRq.Request.TrainSteps[this.jupiterTrainAvailabilityRq.Request.TrainSteps.length - 1].ConnectorCustomData = [];

      //departureStation = this.jupiterTrainAvailabilityRq.Request.TrainSteps[this.jupiterTrainAvailabilityRq.Request.TrainSteps.length - 1].ConnectorCustomData;
    }

    let step = new TrainStepRequest({
      DepartureDate: departureDate.format('YYYY-MM-DD'),
      //DepartureAirport: departureStation,
      //ArrivalAirport: '',
      //Cabin: EFlightCabin.ECONOMY,
      //EnableJumpCabin: true,
      //BaggageIncluded: false,
      OnlyDirectTrains: false,
      ExcludedCarriers: [],
      IncludedCarriers: [],
      DepartureTime: null,
      DepartureTimeWindow: null,
      ConnectorCustomData: [],
    });

    // Additional Properties
    step['_DepartureDateMoment'] = departureDate;
    step['_ConnectorCustomDataConnectors'] = [];

    this.jupiterTrainAvailabilityRq.Request.TrainSteps.push(step);
  }

  deleteStep(index: number) {
    this.jupiterTrainAvailabilityRq.Request.TrainSteps.splice(index, 1);
  }

  handleDateChange($event, step: TrainStepRequest) {
    step.DepartureDate = moment($event).format('YYYY-MM-DD');
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param value
   */
  searchConnectorsChanged(value: EH2HConnectorCode[]) {
    this.jupiterTrainAvailabilityRq.Request.ConnectorsSearch = value;

    for (let connector of value) {
      switch (connector) {
        case EH2HConnectorCode.EMINDS:
          if (!_.some(this.jupiterTrainAvailabilityRq.Request.ConnectorCustomData, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.EMINDS;
          })) {
            this.jupiterTrainAvailabilityRq.Request.ConnectorCustomData.push(new EmindsTrainAvailabilityInputCustomData({
              CommunityId: ""
            }));
          }
          break;
      }
    }
  }
  /**
   * Delete custom data
   */
  deleteCustomData(index: number) {
    this.jupiterTrainAvailabilityRq.Request.ConnectorCustomData.splice(index, 1);
    this.jupiterTrainAvailabilityRq.Request.ConnectorsSearch.splice(index, 1);
  }

  /**
   * Callback Changed Step ConnectorCustomDataCode -> add Step Connector custom data
   * @param connector
   * @param room
   */
  stepConnectorCustomDataConnectorCodeChanged(value: EH2HConnectorCode[], step: TrainStepRequest) {
    step['_ConnectorCustomDataConnectors'] = value;

    for (let connector of value) {
      switch (connector) {
        case EH2HConnectorCode.EMINDS:
          if (!_.some(step.ConnectorCustomData, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.EMINDS;
          })) {
            let customData = new EmindsTrainStepRequestCustomData({
              DepartureStation: "1650",
              ArrivalStation: "8349"
            });

            step.ConnectorCustomData.push(customData);
          }
          break;
      }
    }
  }

  /**
   * Delete step custom data
   */
  deleteStepCustomData(index: number, step: FlightStepRequest) {
    step.ConnectorCustomData.splice(index, 1);
    step['_ConnectorCustomDataConnectors'].splice(index, 1);
  }



  /**
   * Execute the train search
   */
  searchTrains() {
    this.loading = true;

    this.jupiterTrainAvailabilityRs = null;

    this.jupiterApiService.trainAvailability(this.jupiterTrainAvailabilityRq).subscribe(response => {
      this.jupiterTrainAvailabilityRs = response;
      this.accordionItemRq.close();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'trainAvailability Error',
          error: error
        },
      });
    });
  }

  isSegmentFare(arr: number[], index: number){
    return _.includes(arr, index);
  }
}
