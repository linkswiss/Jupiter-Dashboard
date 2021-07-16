import { Component, OnInit, ViewChild } from '@angular/core';
import { NbAccordionItemComponent, NbDialogService } from '@nebular/theme';
import Utils from '../../../../utility/utils';
import {
  AlamoCarBookCancelInputCustomData,
  AlamoCarBookDetailInputCustomData,
  EBookingStatus,
  EH2HConnectorCode,
  EH2HOperation, JupiterCarAvailabilityRQ, JupiterCarAvailabilityRS,
  JupiterCarBookCancelInput,
  JupiterCarBookCancelRQ,
  JupiterCarBookCancelRS,
  JupiterCarBookDetailInput,
  JupiterCarBookDetailOutput,
  JupiterCarBookDetailRQ,
  JupiterCarBookDetailRS
} from '../../../../services/jupiter-api/jupiter-api-client';
import { JupiterApiService } from '../../../../services/jupiter-api/jupiter-api.service';
import { AppConfigService } from '../../../../services/app-config/app-config.service';
import { DialogApiErrorComponent } from '../../common/components/dialog-api-error/dialog-api-error.component';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'jupiter-car-book-detail',
  templateUrl: './car-book-detail.component.html',
  styleUrls: ['./car-book-detail.component.scss']
})
export class CarBookDetailComponent implements OnInit {
  @ViewChild('accordionItemBookDetailRq', { static: true }) accordionItemBookDetailRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;
  showPricePerDay = false;
  // Todo Calculate daysCount
  daysCount = 0;

  jupiterCarBookCancelRq: JupiterCarBookCancelRQ = null;
  jupiterCarBookCancelRs: JupiterCarBookCancelRS = null;

  jupiterCarBookDetailRq: JupiterCarBookDetailRQ = null;
  jupiterCarBookDetailRs: JupiterCarBookDetailRS = null;

  EBookingStatus = EBookingStatus;
  EH2HConnectorCode = EH2HConnectorCode;

  connectors: EH2HConnectorCode[] = null;

  constructor(private dialogService: NbDialogService, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.CAR_BOOK_DETAIL);
    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){
      switch (this.jupiterApiService.selectedLogMethod) {
        case EH2HOperation.CAR_BOOK_DETAIL:
          this.jupiterCarBookDetailRq = JupiterCarBookDetailRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
          this.jupiterCarBookDetailRs = JupiterCarBookDetailRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
          this.jupiterApiService.selectedLogMethod = null;
          this.jupiterApiService.selectedLogRqJson = null;
          this.jupiterApiService.selectedLogRsJson = null;
          break;
        case EH2HOperation.CAR_BOOK_CANCEL:
          this.jupiterCarBookCancelRq = JupiterCarBookCancelRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
          this.jupiterCarBookCancelRs = JupiterCarBookCancelRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
          this.jupiterApiService.selectedLogMethod = null;
          this.jupiterApiService.selectedLogRqJson = null;
          this.jupiterApiService.selectedLogRsJson = null;
          break;
          break;
      }
    }else {
      this.jupiterCarBookDetailRq = new JupiterCarBookDetailRQ({
        Request: new JupiterCarBookDetailInput({
          ConnectorsDebug: null,
          ConnectorCode: null,
          ConnectorCustomData: null,
          PnrNumber: null
        })
      });
    }
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  handleConnectorsChanged(connector: EH2HConnectorCode) {
    switch (connector) {
      case EH2HConnectorCode.HERTZ:
        this.jupiterCarBookDetailRq.Request.PnrNumber = 'J64841346B1';
        break;
      case EH2HConnectorCode.ALAMO:
        this.jupiterCarBookDetailRq.Request.PnrNumber = '2001521262COUNT';

        this.jupiterCarBookDetailRq.Request.ConnectorCustomData = new AlamoCarBookDetailInputCustomData({
          DriverName: 'LUIGI',
          DriverSurname: 'JUPITER'
        });
        break;
    }
  }

  /**
   * Delete custom data
   */
  deleteCustomData() {
    this.jupiterCarBookDetailRq.Request.ConnectorCustomData = null;
  }

  doBookDetail() {
    this.loading = true;

    this.jupiterApiService.carBookDetails(this.jupiterCarBookDetailRq).subscribe(response => {
      this.jupiterCarBookDetailRs = response;
      this.accordionItemBookDetailRq.close();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'carBookDetails Error',
          error: error
        },
      });
    });
  }

  deleteBookFromDetail(bookDetail: JupiterCarBookDetailOutput) {
    this.loading = true;

    this.jupiterCarBookCancelRq = new JupiterCarBookCancelRQ({
      Request: new JupiterCarBookCancelInput({
        ConnectorCode: bookDetail.ConnectorCode,
        PnrNumber: bookDetail.Pnr,
        ConnectorCustomData: null,
        ConnectorsDebug : this.jupiterCarBookDetailRq.Request.ConnectorsDebug
      }),
      ConnectorsEnvironment: this.jupiterCarBookDetailRq.ConnectorsEnvironment
    });

    // Add ALAMO required custom data that should be present in the detail RQ
    if (bookDetail.ConnectorCode === EH2HConnectorCode.ALAMO) {
      this.jupiterCarBookCancelRq.Request.ConnectorCustomData = new AlamoCarBookCancelInputCustomData({
        DriverSurname: (this.jupiterCarBookDetailRq.Request.ConnectorCustomData as AlamoCarBookDetailInputCustomData).DriverSurname,
        DriverName: (this.jupiterCarBookDetailRq.Request.ConnectorCustomData as AlamoCarBookDetailInputCustomData).DriverName
      });
    }

    this.jupiterApiService.carBookCancel(this.jupiterCarBookCancelRq).subscribe(response => {
      this.jupiterCarBookCancelRs = response;
      // Update the Book
      this.doBookDetail();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'carBookCancel Error',
          error: error
        },
      });
    });
  }
}
