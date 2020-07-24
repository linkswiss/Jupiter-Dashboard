import {Component, Input, OnInit} from '@angular/core';
import {NbComponentStatus, NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'jupiter-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.scss']
})
export class DialogMessageComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() status: NbComponentStatus;

  messageTypeString = '';

  constructor(protected ref: NbDialogRef<DialogMessageComponent>) {
  }

  dismiss() {
    this.ref.close();
  }

  ngOnInit() {
  }

}
