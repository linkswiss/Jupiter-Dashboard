import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {
  AmadeusFlightAvailabilityInputCustomData,
  AmadeusFlightBookPnrCustomData,
  AmadeusFlightDetailInputCustomData,
  AmadeusFlightPnrCustomData,
  AmadeusFlightStepRequestCustomData,
  AvailabilityInputCustomData,
  CreditCardInfo,
  ECreditCardType,
  EFlightCabin,
  EH2HConnectorCode,
  EH2HOperation,
  ETripType,
  FlightBookPnr,
  FlightFareGroupResult,
  FlightStepRequest,
  FlightStepRequestCustomData,
  JupiterFlightAvailabilityInput,
  JupiterFlightAvailabilityRQ,
  JupiterFlightAvailabilityRS,
  JupiterFlightBookInput,
  JupiterFlightBookRQ,
  JupiterFlightBookRS,
  JupiterFlightDetailInput,
  JupiterFlightDetailRQ,
  JupiterFlightDetailRS,
  PnrTravelCompany,
  SabreFlightAvailabilityInputCustomData,
  SabreFlightStepRequestCustomData,
  SingleFlightAvailResult,
  TravelFusionFlightStepRequestCustomData,
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import Utils from '../../../../utility/utils';
import {CustomDataInputSettings} from '../../common/components/custom-data-inputs/custom-data-inputs.component';
import {NbAccordionItemComponent, NbDialogService} from '@nebular/theme';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';

@Component({
  selector: 'jupiter-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss'],
})
export class FlightSearchComponent implements OnInit {
  @ViewChild('accordionItemRq', {static: true}) accordionItemRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;

  jupiterFlightAvailabilityRq: JupiterFlightAvailabilityRQ = null;
  jupiterFlightAvailabilityRs: JupiterFlightAvailabilityRS = null;

  selectedResult: SingleFlightAvailResult = null;

  jupiterFlightDetailRq: JupiterFlightDetailRQ = null;
  jupiterFlightDetailRs: JupiterFlightDetailRS = null;

  jupiterFlightBookRq: JupiterFlightBookRQ = null;
  jupiterFlightBookRs: JupiterFlightBookRS = null;

  EFlightCabin = EFlightCabin;
  EFlightCabinList = Object.keys(EFlightCabin);

  connectors: EH2HConnectorCode[] = null;

  viewPortItems: SingleFlightAvailResult[];

  constructor(private dialogService: NbDialogService, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.FLIGHT_AVAIL);

    this.jupiterFlightAvailabilityRq = new JupiterFlightAvailabilityRQ({
      ForceNotCachedResponse: true,
      ConnectorsEnvironment: [],
      Request: new JupiterFlightAvailabilityInput({
        ConnectorsDebug: [],
        ConnectorsSearch: [],
        AdultCount: 2,
        ChildCount: 0,
        InfantCount: 0,
        MergeConnectorResults: false,
        ConnectorCustomData: [],
        FlightSteps: [],
      })
    });

    // Add 1 step
    this.addStep();
  }

  /**
   * Add Flight Step to Request
   */
  addStep() {
    let departureDate = moment();
    let departureAirport = '';
    if (this.jupiterFlightAvailabilityRq.Request.FlightSteps.length > 0) {
      departureDate = moment(this.jupiterFlightAvailabilityRq.Request.FlightSteps[this.jupiterFlightAvailabilityRq.Request.FlightSteps.length - 1].DepartureDate).add(1, 'days');
      departureAirport = this.jupiterFlightAvailabilityRq.Request.FlightSteps[this.jupiterFlightAvailabilityRq.Request.FlightSteps.length - 1].ArrivalAirport;
    }

    let step = new FlightStepRequest({
      DepartureDate: departureDate.format('YYYY-MM-DD'),
      DepartureAirport: departureAirport,
      ArrivalAirport: '',
      Cabin: EFlightCabin.ECONOMY,
      EnableJumpCabin: true,
      BaggageIncluded: false,
      OnlyDirectFlights: false,
      ExcludedCarriers: [],
      IncludedCarriers: [],
      DepartureTime: null,
      DepartureTimeWindow: null,
      ConnectorCustomData: [],
    });

    // Additional Properties
    step['_DepartureDateMoment'] = departureDate;
    step['_ConnectorCustomDataConnectors'] = [];

    this.jupiterFlightAvailabilityRq.Request.FlightSteps.push(step);

    // this.jupiterFlightAvailabilityRq.Request.FlightSteps.push({
    //   Cabin: 'ECONOMY',
    // });
  }

  deleteStep(index: number) {
    this.jupiterFlightAvailabilityRq.Request.FlightSteps.splice(index, 1);
  }

  handleDateChange($event, step: FlightStepRequest) {
    step.DepartureDate = moment($event).format('YYYY-MM-DD');
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param value
   */
  searchConnectorsChanged(value: EH2HConnectorCode[]) {
    this.jupiterFlightAvailabilityRq.Request.ConnectorsSearch = value;

    for (let connector of value) {
      switch (connector) {
        case EH2HConnectorCode.AMADEUS:
          if (!_.some(this.jupiterFlightAvailabilityRq.Request.ConnectorCustomData, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.AMADEUS;
          })) {
            this.jupiterFlightAvailabilityRq.Request.ConnectorCustomData.push(new AmadeusFlightAvailabilityInputCustomData({
              IsExpertSearch: false,
              AccountCodes: [],
              EnableFareFamilies: true,
            }));
          }
          break;
        case EH2HConnectorCode.SABRE:
          if (!_.some(this.jupiterFlightAvailabilityRq.Request.ConnectorCustomData, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.SABRE;
          })) {
            let customData = new SabreFlightAvailabilityInputCustomData({
              AccountCodes: [],
              NumTrips: null,
              KeepSameCabin: false,
              VoluntaryChanges: false,
              MultipleBrandedFares: false,
              IncludeAlliancePref: [],
              ExcludeAlliancePref: [],
              MaxStopsQuantity: null,
              TripType: null,
            });

            // Add Custom Data Input Settings
            customData['_CustomDataInputSettings'] = new CustomDataInputSettings({
              dateProps: [],
              numProps: ['NumTrips', 'MaxStopsQuantity'],
              tagProps: ['IncludeAlliancePref', 'ExcludeAlliancePref'],
              enumProps: ['TripType'],
              boolProps: [],
              objProps: [],
              objArrayProps: [],
              omitProps: [],
              enums: {'TripType': Object.keys(ETripType)}
            });

            this.jupiterFlightAvailabilityRq.Request.ConnectorCustomData.push(customData);
          }
          break;
        case EH2HConnectorCode.TRAVELFUSION:
          // NO CUSTOM DATA
          break;
      }
    }
  }

  /**
   * Delete custom data
   */
  deleteCustomData(index: number) {
    this.jupiterFlightAvailabilityRq.Request.ConnectorCustomData.splice(index, 1);
    this.jupiterFlightAvailabilityRq.Request.ConnectorsSearch.splice(index, 1);
  }

  /**
   * Set Departure Airport IATA to Uppercase
   * @param $event
   * @param step
   */
  setDepartureAirport($event: string, step: FlightStepRequest) {
    step.DepartureAirport = $event.toUpperCase();
  }

  /**
   * Set Arrival Airport IATA to Uppercase
   * @param $event
   * @param step
   */
  setArrivalAirport($event: string, step: FlightStepRequest) {
    step.ArrivalAirport = $event.toUpperCase();
  }

  /**
   * Callback Changed Step ConnectorCustomDataCode -> add Step Connector custom data
   * @param connector
   * @param room
   */
  stepConnectorCustomDataConnectorCodeChanged(value: EH2HConnectorCode[], step: FlightStepRequest) {
    step['_ConnectorCustomDataConnectors'] = value;

    for (let connector of value) {
      switch (connector) {
        case EH2HConnectorCode.AMADEUS:
          if (!_.some(step.ConnectorCustomData, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.AMADEUS;
          })) {
            let customData = new AmadeusFlightStepRequestCustomData({});

            // Add Custom Data Input Settings
            customData['_CustomDataInputSettings'] = new CustomDataInputSettings({
              dateProps: [],
              numProps: ['NumTrips', 'MaxStopsQuantity'],
              tagProps: ['IncludeAlliancePref', 'ExcludeAlliancePref'],
              enumProps: ['TripType'],
              boolProps: [],
              objProps: [],
              objArrayProps: [],
              omitProps: [],
              enums: {'TripType': Object.keys(ETripType)}
            });

            step.ConnectorCustomData.push(customData);
          }
          break;
        case EH2HConnectorCode.SABRE:
          if (!_.some(step.ConnectorCustomData, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.SABRE;
          })) {
            let customData = new SabreFlightStepRequestCustomData({
              ConnectionTimeMin: null,
              ConnectionTimeMax: null,
              SisterOriginLocation: [],
              SisterDestinationLocation: []
            });

            // Add Custom Data Input Settings
            customData['_CustomDataInputSettings'] = new CustomDataInputSettings({
              dateProps: [],
              numProps: ['ConnectionTimeMin', 'ConnectionTimeMax'],
              tagProps: ['SisterOriginLocation', 'SisterDestinationLocation'],
              enumProps: [],
              boolProps: [],
              objProps: [],
              objArrayProps: [],
              omitProps: [],
              enums: null
            });

            step.ConnectorCustomData.push(customData);
          }
          break;
        case EH2HConnectorCode.TRAVELFUSION:
          if (!_.some(step.ConnectorCustomData, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.SABRE;
          })) {
            let customData = new TravelFusionFlightStepRequestCustomData({
              MaxChange: null,
              MaxHop: null,
              TimeOut: null,
              ShowCheckInCharges: true,
              ShowLuggageCharges: true,
              ShowSpeedyBoardingCharges: true,
            });

            // Add Custom Data Input Settings
            customData['_CustomDataInputSettings'] = new CustomDataInputSettings({
              dateProps: [],
              numProps: ['MaxChange', 'MaxHop', 'MaxHop', 'TimeOut'],
              tagProps: ['SisterOriginLocation', 'SisterDestinationLocation'],
              enumProps: [],
              boolProps: ['ShowCheckInCharges', 'ShowLuggageCharges', 'ShowSpeedyBoardingCharges'],
              objProps: [],
              objArrayProps: [],
              omitProps: [],
              enums: null
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

  resetSelected(){
    this.jupiterFlightDetailRq = null;
    this.jupiterFlightDetailRs = null;
    this.jupiterFlightBookRq = null;
    this.jupiterFlightBookRs = null;

    this.selectedResult = null;
  }

  /**
   * Execute the flight search
   */
  searchFlights() {
    this.loading = true;

    this.jupiterFlightDetailRq = null;
    this.jupiterFlightDetailRs = null;
    this.jupiterFlightBookRq = null;
    this.jupiterFlightBookRs = null;
    this.jupiterFlightAvailabilityRs = null;

    this.selectedResult = null;

    this.jupiterApiService.flightAvailability(this.jupiterFlightAvailabilityRq).subscribe(response => {
      this.jupiterFlightAvailabilityRs = response;
      this.accordionItemRq.close();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'flightAvailability Error',
          error: error
        },
      });
    });
  }

  /**
   * Execute the flight details
   * @param singleFlightAvailResult
   * @param flightFareGroupResult
   */
  flightDetails(singleFlightAvailResult: SingleFlightAvailResult, flightFareGroupResult: FlightFareGroupResult, isBestPrice = false) {
    this.loading = true;

    //Set Current selected
    if(!this.selectedResult || this.selectedResult.Id !== singleFlightAvailResult.Id){
      this.selectedResult = singleFlightAvailResult;
    }

    //Copy and get the single fare selected
    let resultCopy = SingleFlightAvailResult.fromJS(JSON.parse(JSON.stringify(singleFlightAvailResult)));
    resultCopy.FareList = _.filter(singleFlightAvailResult.FareList, function (f: FlightFareGroupResult) {
      return f.Id === flightFareGroupResult.Id;
    });

    this.jupiterFlightDetailRq = new JupiterFlightDetailRQ({
      ConnectorsEnvironment: this.jupiterFlightAvailabilityRq.ConnectorsEnvironment,
      Request: new JupiterFlightDetailInput({
        ConnectorCode: flightFareGroupResult.ConnectorCode,
        SelectedFlightAvail: resultCopy,
        ConnectorsDebug: this.jupiterFlightAvailabilityRq.Request.ConnectorsDebug,
      })
    });

    //If Amadeus and isBestPrice force the FareInformativeBestPrice
    if(flightFareGroupResult.ConnectorCode === EH2HConnectorCode.AMADEUS && isBestPrice)
    {
      this.jupiterFlightDetailRq.Request.ConnectorCustomData = new AmadeusFlightDetailInputCustomData({
        FareInformativeBestPrice: true
      });
    }

    this.jupiterApiService.flightDetails(this.jupiterFlightDetailRq).subscribe(response => {
      this.jupiterFlightDetailRs = response;
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'flightDetails Error',
          error: error
        },
      });
    });

    // flightFareGroupResult
  }


  /**
   * Execute the flight book
   */
  flightBook(closePnr: boolean) {
    this.loading = true;

    let pnrString = JSON.stringify(this.jupiterFlightDetailRs.Response.Pnr);
    let bookPnr = <FlightBookPnr>JSON.parse(pnrString);

    bookPnr = new FlightBookPnr({
      AdditionalAncillaries: this.jupiterFlightDetailRs.Response.Pnr.AdditionalAncillaries,
      AlternativeFares: this.jupiterFlightDetailRs.Response.Pnr.AlternativeFares,
      Ancillaries: this.jupiterFlightDetailRs.Response.Pnr.Ancillaries,
      CancelDate: this.jupiterFlightDetailRs.Response.Pnr.CancelDate,
      ClosePnr: this.jupiterFlightDetailRs.Response.Pnr.ClosePnr,
      ConnectorCode: this.jupiterFlightDetailRs.Response.Pnr.ConnectorCode,
      // ConnectorCustomData: this.jupiterFlightDetailRs.Response.Pnr.ConnectorCustomData,
      CreditCardPayment: this.jupiterFlightDetailRs.Response.Pnr.CreditCardPayment,
      Fare: this.jupiterFlightDetailRs.Response.Pnr.Fare,
      FlightSegments: this.jupiterFlightDetailRs.Response.Pnr.FlightSegments,
      LastTicketDate: this.jupiterFlightDetailRs.Response.Pnr.LastTicketDate,
      OsiSsr: this.jupiterFlightDetailRs.Response.Pnr.OsiSsr,
      Paxes: this.jupiterFlightDetailRs.Response.Pnr.Paxes,
      PnrDate: this.jupiterFlightDetailRs.Response.Pnr.PnrDate,
      PnrNumber: this.jupiterFlightDetailRs.Response.Pnr.PnrNumber,
      PseudoCityCode: this.jupiterFlightDetailRs.Response.Pnr.PseudoCityCode,
      Remarks: this.jupiterFlightDetailRs.Response.Pnr.Remarks,
      TravelCompany: this.jupiterFlightDetailRs.Response.Pnr.TravelCompany
    });

    //Close the PNR
    bookPnr.ClosePnr = closePnr;

    // Book the same of detail
    this.jupiterFlightBookRq = new JupiterFlightBookRQ({
      ConnectorsEnvironment: this.jupiterFlightAvailabilityRq.ConnectorsEnvironment,
      Request: new JupiterFlightBookInput({
        Pnr: bookPnr,
        ConnectorsDebug: this.jupiterFlightAvailabilityRq.Request.ConnectorsDebug,
      })
    });

    if (bookPnr.ConnectorCode === EH2HConnectorCode.AMADEUS) {
      // Add Firm
      this.jupiterFlightBookRq.Request.Pnr.ConnectorCustomData = new AmadeusFlightBookPnrCustomData({
        PnrCustomData: new AmadeusFlightPnrCustomData({
          ReceivedFrom: 'John Agent',
          TkXlAutoDeleteDate: moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
        })
      });

      //TODO Remove this to not provide the FOP Call
      //Add fake CC
      this.jupiterFlightBookRq.Request.Pnr.CreditCardPayment = new CreditCardInfo({
        CardHolderFirstName: 'John',
        CardHolderLastName: 'Doe',
        // CreditCardType: ECreditCardType.MASTERCARD,
        CreditCardType: ECreditCardType.VISA,
        CreditCardNumber: '4111111111111111',
        CreditCardCvv: '999',
        ExpireDate: '01/23'
      });

      //Add Travel Agency
      this.jupiterFlightBookRq.Request.Pnr.TravelCompany = new PnrTravelCompany({
        Name: 'My Travel Agency 123123123'
      });
    }

    this.jupiterApiService.flightBook(this.jupiterFlightBookRq).subscribe(response => {
      this.jupiterFlightBookRs = response;
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'flightBook Error',
          error: error
        },
      });
    });

    // flightFareGroupResult
  }
}

export interface FlightStepRequestFormModel {
  DepartureDate: Moment;
  Cabin: EFlightCabin;
  EnableJumpCabin: boolean;
  DepartureAirport: string;
  ArrivalAirport: string;
  ExcludedCarriers: string[];
  IncludedCarriers: string[];
  OnlyDirectFlights: boolean;
  BaggageIncluded: boolean;
  ConnectorCustomData?: (null | FlightStepRequestCustomData[]);
}
