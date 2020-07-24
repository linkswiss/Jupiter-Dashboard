import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import Utils from '../../../../../utility/utils';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'jupiter-form-data-inputs',
  templateUrl: './form-data-inputs.component.html',
  styleUrls: ['./form-data-inputs.component.scss']
})
export class FormDataInputsComponent implements OnInit, OnChanges {
  @Input() Data: any;
  @Output() DataChange = new EventEmitter();

  utils = Utils;

  allProps = [];
  PROP_INPUT_TYPE = PROP_INPUT_TYPE;
  dataInputSettings: DataInputSettings;

  constructor() {
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.allProps = [];

    if (this.Data['_DataInputSettings']) {
      this.dataInputSettings = this.Data['_DataInputSettings'];
    } else {
      this.dataInputSettings = new DataInputSettings({
        dateProps: [],
        enumProps: [],
        numProps: [],
        tagProps: [],
        boolProps: [],
        objProps: [],
        objArrayProps: [],
        omitProps: [],
        enums: null
      });
    }

    for (let prop of Object.keys(this.Data)) {
      if (prop !== '_discriminator' && prop !== '_DataInputSettings' && _.indexOf(this.dataInputSettings.omitProps, prop) === -1) {
        if (this.Data[prop] !== null) {
          if (typeof (this.Data[prop]) === 'object') {
            if (Array.isArray(this.Data[prop])) {
              if (this.Data[prop] && typeof (this.Data[prop][0]) === 'object') {
                this.dataInputSettings.objArrayProps.push(prop);
              } else {
                this.dataInputSettings.tagProps.push(prop);
              }
            } else {
              this.dataInputSettings.objProps.push(prop);
            }
          } else if (typeof (this.Data[prop]) === 'boolean') {
            this.dataInputSettings.boolProps.push(prop);
          } else if (typeof (this.Data[prop]) === 'number') {
            this.dataInputSettings.numProps.push(prop);
          }
        }

        // if( typeof(this.CustomData[prop]))
        this.allProps.push(prop);
      }
    }
  }

  getTypeof(prop) {

    return typeof (this.Data[prop]);
  }

  getType(prop): PROP_INPUT_TYPE {
    if (_.indexOf(this.dataInputSettings.numProps, prop) > -1) {
      return PROP_INPUT_TYPE.NUM;
    }
    if (_.indexOf(this.dataInputSettings.tagProps, prop) > -1) {
      return PROP_INPUT_TYPE.TAG;
    }
    if (_.indexOf(this.dataInputSettings.enumProps, prop) > -1) {
      return PROP_INPUT_TYPE.ENUM;
    }
    if (_.indexOf(this.dataInputSettings.dateProps, prop) > -1) {
      return PROP_INPUT_TYPE.DATE;
    }
    if (_.indexOf(this.dataInputSettings.boolProps, prop) > -1) {
      return PROP_INPUT_TYPE.CHECK;
    }
    if (_.indexOf(this.dataInputSettings.objProps, prop) > -1) {
      return PROP_INPUT_TYPE.OBJ;
    }
    if (_.indexOf(this.dataInputSettings.objArrayProps, prop) > -1) {
      return PROP_INPUT_TYPE.OBJ_ARRAY;
    }
    return PROP_INPUT_TYPE.TEXT;
  }

  handleDateChange($event, prop) {
    this.Data[prop] = moment($event).format('YYYY-MM-DD');
  }
}

export enum PROP_INPUT_TYPE {
  TEXT,
  CHECK,
  NUM,
  TAG,
  ENUM,
  DATE,
  OBJ,
  OBJ_ARRAY,
  OMIT
}

export class DataInputSettings {
  numProps = [];
  dateProps = [];
  tagProps = [];
  boolProps = [];
  objProps = [];
  objArrayProps = [];
  omitProps = [];
  enumProps = [];
  enums = null;

  constructor(data: DataInputSettings) {
    if (data) {
      for (let property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
}
