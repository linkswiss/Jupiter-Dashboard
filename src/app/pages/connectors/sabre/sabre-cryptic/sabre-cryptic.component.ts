import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  ConnectorEnvironment,
  EH2HConnectorCode,
  EOperationStatus,
  JupiterCrypticInput,
  JupiterCrypticRQ,
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';

@Component({
  selector: 'jupiter-sabre-cryptic',
  templateUrl: './sabre-cryptic.component.html',
  styleUrls: ['./sabre-cryptic.component.scss']
})
export class SabreCrypticComponent implements OnInit {
  @ViewChild('sendCrypticInput', {static: true}) sendCrypticInput: any;
  @Input() showHeader = true;

  loading = false;

  crypticResponse: any = null;
  crypticSession: any = null;
  crypticForm: FormGroup;

  apiCallRS: any = null;

  crypticCommand: string = null;
  connectorsEnvironment: ConnectorEnvironment[] = [];
  EH2HConnectorCode = EH2HConnectorCode;

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
      Request: new JupiterCrypticInput({
        // ConnectorsDebug: ['SABRE'],
        ConnectorCode: EH2HConnectorCode.SABRE,
        CrypticRequest: crypticCommand.Command,
        SessionConnectorCustomData: null,
      }),
    });

    if (this.crypticSession) {
      jupiterCrypticRQ.Request.SessionConnectorCustomData = this.crypticSession;
    } else {
      jupiterCrypticRQ.Request.SessionConnectorCustomData = null;
    }

    this.jupiterApiService.cryptic(jupiterCrypticRQ).subscribe(response => {
      this.apiCallRS = response;
      if (response && response.Status === EOperationStatus.SUCCESS && response.Response) {
        // this.crypticForm.patchValue({Command: ''});
        this.crypticResponse = response.Response.CrypticResponse;
        this.crypticSession = response.Response.SessionConnectorCustomData;
      } else {
        this.crypticResponse = 'ERROR';
        if (response.ConnectorsResponseDetails && response.ConnectorsResponseDetails.length > 0) {
          if (response.ConnectorsResponseDetails[0] && response.ConnectorsResponseDetails[0].Messages && response.ConnectorsResponseDetails[0].Messages.length > 0) {
            for (let message of response.ConnectorsResponseDetails[0].Messages) {
              this.crypticResponse += `\n Type: ${message['Type']} Message: ${message['Text']}`;
            }
          }
        }
      }
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }
}
