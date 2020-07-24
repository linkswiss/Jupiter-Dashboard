import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AmadeusGdsSessionCustomData, ConnectorEnvironment,
  EAmadeusSessionStatus,
  EH2HConnectorCode,
  JupiterCrypticInput,
  JupiterCrypticRQ,
} from '../../../../services/jupiter-api/jupiter-api-client';
import { JupiterApiService } from '../../../../services/jupiter-api/jupiter-api.service';

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

  apiCallRS: any = null;

  crypticCommand: string = null;
  connectorsEnvironment: ConnectorEnvironment[] = [];

  constructor(private jupiterApiService: JupiterApiService) {
    this.crypticForm = new FormGroup({
      Command: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
  }

  changeConnectorsEnvironment() {
    this.crypticSession = null;
  }

  sendCryptic() {
    this.loading = true;

    let crypticCommand = this.crypticForm.value;

    const inputElem = <HTMLInputElement>this.sendCrypticInput.nativeElement;
    inputElem.select();

    let jupiterCrypticRQ: JupiterCrypticRQ = new JupiterCrypticRQ({
      ConnectorsEnvironment: this.connectorsEnvironment,
      Request: new JupiterCrypticInput( {
        // ConnectorsDebug: ['AMADEUS'],
        ConnectorCode: EH2HConnectorCode.AMADEUS,
        CrypticRequest: crypticCommand.Command,
        SessionConnectorCustomData: null,
      }),
    });

    if (this.crypticSession) {
      jupiterCrypticRQ.Request.SessionConnectorCustomData = this.crypticSession;
    } else {
      jupiterCrypticRQ.Request.SessionConnectorCustomData = new AmadeusGdsSessionCustomData({
        // customDataConnectorCode: 'AMADEUS',
        SessionId: '',
        SessionStatus: EAmadeusSessionStatus.START,
        SequenceNumber: 0,
        SecurityToken: '',
      });
    }

    this.jupiterApiService.cryptic(jupiterCrypticRQ).subscribe(response => {
      this.apiCallRS = response;
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
}
