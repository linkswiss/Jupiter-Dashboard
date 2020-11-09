import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'jupiter-obj-display',
  templateUrl: './obj-display.component.html',
  styleUrls: ['./obj-display.component.scss']
})
export class ObjDisplayComponent implements OnInit {
  @Input() Data: any;
  @Input() DisplayArray = true;
  @Input() DisplayObjects = true;
  @Input() StyleClass: string;

  allProps = [];

  constructor() {
  }

  ngOnInit() {
    if(this.Data){
      this.allProps = Object.keys(this.Data);
    }
  }

  getTypeof(prop): string {
    let objType = typeof (this.Data[prop]);
    let strObjType = '';

    if (objType === 'object' && Array.isArray(this.Data[prop])) {
      strObjType = 'array';
    } else {
      strObjType = objType;
    }

    return strObjType;
  }
}
