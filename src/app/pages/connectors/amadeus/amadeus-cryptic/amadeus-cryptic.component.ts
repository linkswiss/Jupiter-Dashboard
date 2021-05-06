import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  AmadeusGdsSessionCustomData,
  ConnectorEnvironment,
  EAmadeusSessionStatus,
  EH2HConnectorCode,
  JupiterCrypticInput,
  JupiterCrypticRQ, JupiterCrypticRS,
  JupiterFlightPnrRetrieveInput,
  JupiterFlightPnrRetrieveRQ,
  JupiterFlightPnrRetrieveRS,
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';

@Component({
  selector: 'jupiter-amadeus-cryptic',
  templateUrl: './amadeus-cryptic.component.html',
  styleUrls: ['./amadeus-cryptic.component.scss']
})
export class AmadeusCrypticComponent implements OnInit {
  @ViewChild('sendCrypticInput', {static: true}) sendCrypticInput: any;
  @Input() showHeader = true;

  loading = false;

  crypticResponse: any = null;
  crypticSession: any = null;
  crypticForm: FormGroup;

  jupiterFlightPnrRetrieveRq: JupiterFlightPnrRetrieveRQ = null;
  jupiterFlightPnrRetrieveRs: JupiterFlightPnrRetrieveRS = null;

  jupiterCrypticRq: JupiterCrypticRQ = null;
  jupiterCrypticRs: JupiterCrypticRS = null;

  crypticCommand: string = null;
  connectorsEnvironment: ConnectorEnvironment[] = [];
  EH2HConnectorCode = EH2HConnectorCode;

  constructor(private jupiterApiService: JupiterApiService) {
    this.crypticForm = new FormGroup({
      Command: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){
      this.jupiterCrypticRq = JupiterCrypticRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
      this.jupiterCrypticRs = JupiterCrypticRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));

      if (this.jupiterCrypticRs && this.jupiterCrypticRs.Response) {
        this.crypticResponse = this.jupiterCrypticRs.Response.CrypticResponse;
        this.crypticSession = this.jupiterCrypticRs.Response.SessionConnectorCustomData;
      } else {
        this.crypticResponse = 'ERROR';
      }

      this.jupiterApiService.selectedLogMethod = null;
      this.jupiterApiService.selectedLogRqJson = null;
      this.jupiterApiService.selectedLogRsJson = null;
    }else {
      this.jupiterCrypticRq = new JupiterCrypticRQ({
        ConnectorsEnvironment: null,
        Request: new JupiterCrypticInput({
          // ConnectorsDebug: ['AMADEUS'],
          ConnectorCode: EH2HConnectorCode.AMADEUS,
          CrypticRequest: null,
          SessionConnectorCustomData: null,
        }),
      });
    }
  }

  changeConnectorsEnvironment() {
    this.crypticSession = null;
  }

  sendCryptic() {
    this.loading = true;

    this.jupiterCrypticRq.ConnectorsEnvironment = this.connectorsEnvironment;
    this.jupiterCrypticRq.Request.CrypticRequest = this.crypticForm.value.Command;

    const inputElem = <HTMLInputElement>this.sendCrypticInput.nativeElement;
    inputElem.select();

    if (this.crypticSession) {
      this.jupiterCrypticRq.Request.SessionConnectorCustomData = this.crypticSession;
    } else {
      this.jupiterCrypticRq.Request.SessionConnectorCustomData = new AmadeusGdsSessionCustomData({
        // customDataConnectorCode: 'AMADEUS',
        SessionId: '',
        SessionStatus: EAmadeusSessionStatus.START,
        SequenceNumber: 0,
        SecurityToken: '',
      });
    }

    this.jupiterApiService.cryptic(this.jupiterCrypticRq).subscribe(response => {
      this.jupiterCrypticRs = response;
      if (response && response.Response) {
        // this.crypticForm.patchValue({Command: ''});
        this.crypticResponse = response.Response.CrypticResponse;
        this.crypticSession = response.Response.SessionConnectorCustomData;
      } else {
        this.crypticResponse = 'ERROR';
      }
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  retrieveFromSession() {
    this.jupiterFlightPnrRetrieveRq = new JupiterFlightPnrRetrieveRQ({
      ConnectorsEnvironment: this.connectorsEnvironment,
      Request: new JupiterFlightPnrRetrieveInput({
        ConnectorCode: EH2HConnectorCode.AMADEUS,
        SessionConnectorCustomData: this.crypticSession
      })
    });
  }
}
