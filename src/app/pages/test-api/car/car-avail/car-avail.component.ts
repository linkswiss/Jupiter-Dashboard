import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {
  AlamoCarAvailabilityInputCustomData,
  CarAvailabilityInputCustomData,
  CarRequest,
  CarRequestCustomData,
  EH2HConnectorCode,
  EH2HOperation,
  EPaxType,
  ESpecialEquipmentType,
  EVendorType,
  HertzCarAvailabilityInputCustomData,
  HertzCarRequestCustomData,
  JupiterCarAvailabilityInput,
  JupiterCarAvailabilityRQ,
  JupiterCarAvailabilityRS, JupiterTrainAvailabilityRQ, JupiterTrainAvailabilityRS,
  SingleCarAvailResult,
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import Utils from '../../../../utility/utils';
import {NbAccordionItemComponent, NbDialogService} from '@nebular/theme';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';

@Component({
  selector: 'jupiter-car-search',
  templateUrl: './car-avail.component.html',
  styleUrls: ['./car-avail.component.scss'],
})
export class CarAvailComponent implements OnInit {
  @ViewChild('accordionItemRq', {static: true}) accordionItemRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;

  jupiterCarAvailabilityRq: JupiterCarAvailabilityRQ = null;
  jupiterCarAvailabilityRs: JupiterCarAvailabilityRS = null;

  viewPortItems: SingleCarAvailResult[];
  showPricePerDay = false;
  daysCount = 0;

  EPaxType = EPaxType;
  EPaxTypeList = Object.keys(EPaxType);
  EH2HConnectorCode = EH2HConnectorCode;
  connectors: EH2HConnectorCode[] = null;

  constructor(private dialogService: NbDialogService, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.CAR_AVAIL);

    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){
      this.jupiterCarAvailabilityRq = JupiterCarAvailabilityRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
      this.jupiterCarAvailabilityRs = JupiterCarAvailabilityRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
      this.jupiterApiService.selectedLogMethod = null;
      this.jupiterApiService.selectedLogRqJson = null;
      this.jupiterApiService.selectedLogRsJson = null;
    }else {
      let depTime = "08:00";
      let arrTime = "08:00";
      let depDate = moment().add(1, 'days');
      let arrDate = moment().add(5, 'days');

      let carRequest = new CarRequest({
        DepartureDate: depDate.format('YYYY-MM-DD') + ' ' + depTime,
        ArrivalDate: arrDate.format('YYYY-MM-DD') + ' ' + arrTime,
        DepartureLocation: '',
        ArrivalLocation: '',
        ConnectorCustomData: []
      });

      // Additional Properties
      carRequest['_DepartureDateMoment'] = depDate;
      carRequest['_DepartureTimeMoment'] = depTime;
      carRequest['_ArrivalDateMoment'] = arrDate;
      carRequest['_ArrivalTimeMoment'] = arrTime;

      this.jupiterCarAvailabilityRq = new JupiterCarAvailabilityRQ({
        ForceNotCachedResponse: true,
        ConnectorsEnvironment: [],
        Request: new JupiterCarAvailabilityInput({
          ConnectorsDebug: [],
          ConnectorsSearch: [],
          ConnectorCustomData: [],
          CarRequest: carRequest
        })
      });
    }

  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  searchConnectorsChanged(value: EH2HConnectorCode[]) {
    this.jupiterCarAvailabilityRq.Request.ConnectorsSearch = value;

    for (let connector of value) {
      switch (connector) {
        case EH2HConnectorCode.HERTZ:
            if (!_.some(this.jupiterCarAvailabilityRq.Request.ConnectorCustomData, function (c: CarAvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.HERTZ;
            })) {
              this.jupiterCarAvailabilityRq.Request.CarRequest.DepartureLocation = 'PHX';
              this.jupiterCarAvailabilityRq.Request.CarRequest.ArrivalLocation = 'PHX';

              this.jupiterCarAvailabilityRq.Request.ConnectorCustomData.push(new HertzCarAvailabilityInputCustomData({
                Vendors: [EVendorType.HERTZ, EVendorType.DOLLAR]
              }));
            }
            break;
        case EH2HConnectorCode.ALAMO:
            if (!_.some(this.jupiterCarAvailabilityRq.Request.ConnectorCustomData, function (c: CarAvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.ALAMO;
            })) {
              this.jupiterCarAvailabilityRq.Request.CarRequest.DepartureLocation = 'DABT71';
              this.jupiterCarAvailabilityRq.Request.CarRequest.ArrivalLocation = 'DABT71';
              this.jupiterCarAvailabilityRq.Request.DriverAge = 30;

              this.jupiterCarAvailabilityRq.Request.ConnectorCustomData.push(new AlamoCarAvailabilityInputCustomData({
                VendorCode: 'AL'
              }));
            }
            break;
      }
    }
  }

  /**
   * Callback Changed the carRequest Connector -> Add Custom data
   * @param connector
   */
  carRequestConnectorsChanged(value: EH2HConnectorCode[]) {
    this.jupiterCarAvailabilityRq.Request.ConnectorsSearch = value;

    for (let connector of value) {
      switch (connector) {
        case EH2HConnectorCode.HERTZ:
            if (!_.some(this.jupiterCarAvailabilityRq.Request.CarRequest.ConnectorCustomData, function (c: CarRequestCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.HERTZ;
            })) {
              this.jupiterCarAvailabilityRq.Request.CarRequest.ConnectorCustomData.push(new HertzCarRequestCustomData({
                SpecialEquipments: [ESpecialEquipmentType.NAV, ESpecialEquipmentType.CST]
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
    this.jupiterCarAvailabilityRq.Request.ConnectorCustomData.splice(index, 1);
  }

  /**
   * Delete custom data
   */
  deleteCarCustomData(index: number) {
    this.jupiterCarAvailabilityRq.Request.CarRequest.ConnectorCustomData.splice(index, 1);
  }


  /**
   * Compose the datetime
   */
  handleDepartureDate($event) {
    this.jupiterCarAvailabilityRq.Request.CarRequest.DepartureDate = moment($event).format('YYYY-MM-DD') + ' ' + this.jupiterCarAvailabilityRq.Request.CarRequest['_DepartureTimeMoment'];
  }

  handleArrivalDate($event) {
    this.jupiterCarAvailabilityRq.Request.CarRequest.ArrivalDate = moment($event).format('YYYY-MM-DD') + ' ' + this.jupiterCarAvailabilityRq.Request.CarRequest['_ArrivalTimeMoment'];
  }

  handleDepartureTime($event) {
    this.jupiterCarAvailabilityRq.Request.CarRequest.DepartureDate = this.jupiterCarAvailabilityRq.Request.CarRequest['_DepartureDateMoment'].format('YYYY-MM-DD') + ' ' + $event.target.value;
  }

  handleArrivalTime($event) {
    this.jupiterCarAvailabilityRq.Request.CarRequest.ArrivalDate = this.jupiterCarAvailabilityRq.Request.CarRequest['_ArrivalDateMoment'].format('YYYY-MM-DD') + ' ' +  $event.target.value;
  }

  /**
   * Execute the Availability Search
   */
  searchCarAvailability() {
    this.loading = true;

    this.jupiterApiService.carAvailability(this.jupiterCarAvailabilityRq).subscribe(response => {
      this.jupiterCarAvailabilityRs = response;
      this.daysCount = moment(this.jupiterCarAvailabilityRq.Request.CarRequest.ArrivalDate).diff(moment(this.jupiterCarAvailabilityRq.Request.CarRequest.DepartureDate), 'days');

      this.accordionItemRq.close();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'carAvailability Error',
          error: error
        },
      });
    });
  }
}
