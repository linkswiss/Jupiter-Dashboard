import {Component, Input, OnInit} from '@angular/core';
import {EOperationStatus} from '../../../../../services/jupiter-api/jupiter-api-client';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'jupiter-dialog-api-error',
  templateUrl: './dialog-api-error.component.html',
  styleUrls: ['./dialog-api-error.component.scss']
})
export class DialogApiErrorComponent implements OnInit {
  @Input() title: string;
  @Input() error: string;

  constructor(protected ref: NbDialogRef<DialogApiErrorComponent>) {}

  dismiss() {
    this.ref.close();
  }

  ngOnInit() {
  }

}
