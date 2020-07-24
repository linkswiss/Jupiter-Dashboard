import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {IHGHotelBookSearchInputCustomData} from '../../../../../services/jupiter-api/jupiter-api-client';
import Utils from '../../../../../utility/utils';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'jupiter-custom-data-inputs',
  templateUrl: './custom-data-inputs.component.html',
  styleUrls: ['./custom-data-inputs.component.scss']
})
export class CustomDataInputsComponent implements OnInit, OnChanges {
  @Input() CustomData: any;
  @Output() CustomDataChange = new EventEmitter();

  utils = Utils;

  allProps = [];
  PROP_INPUT_TYPE = PROP_INPUT_TYPE;
  CustomDataInputSettings: CustomDataInputSettings;

  constructor() {
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.allProps = [];

    if (this.CustomData['_CustomDataInputSettings']) {
      this.CustomDataInputSettings = this.CustomData['_CustomDataInputSettings'];
    } else {
      this.CustomDataInputSettings = new CustomDataInputSettings({
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

    for (let prop of Object.keys(this.CustomData)) {
      if (prop !== '_discriminator' && prop !== '_CustomDataInputSettings' && _.indexOf(this.CustomDataInputSettings.omitProps, prop) === -1) {
        if (this.CustomData[prop] !== null) {
          if (typeof (this.CustomData[prop]) === 'object') {
            if (Array.isArray(this.CustomData[prop])) {
              if (this.CustomData[prop] && typeof (this.CustomData[prop][0]) === 'object') {
                this.CustomDataInputSettings.objArrayProps.push(prop);
              } else {
                this.CustomDataInputSettings.tagProps.push(prop);
              }
            } else {
              this.CustomDataInputSettings.objProps.push(prop);
            }
          } else if (typeof (this.CustomData[prop]) === 'boolean') {
            this.CustomDataInputSettings.boolProps.push(prop);
          } else if (typeof (this.CustomData[prop]) === 'number') {
            this.CustomDataInputSettings.numProps.push(prop);
          }
        }

        // if( typeof(this.CustomData[prop]))
        this.allProps.push(prop);
      }
    }
  }

  getTypeof(prop) {

    return typeof (this.CustomData[prop]);
  }

  getType(prop): PROP_INPUT_TYPE {
    if (_.indexOf(this.CustomDataInputSettings.numProps, prop) > -1) {
      return PROP_INPUT_TYPE.NUM;
    }
    if (_.indexOf(this.CustomDataInputSettings.tagProps, prop) > -1) {
      return PROP_INPUT_TYPE.TAG;
    }
    if (_.indexOf(this.CustomDataInputSettings.enumProps, prop) > -1) {
      return PROP_INPUT_TYPE.ENUM;
    }
    if (_.indexOf(this.CustomDataInputSettings.dateProps, prop) > -1) {
      return PROP_INPUT_TYPE.DATE;
    }
    if (_.indexOf(this.CustomDataInputSettings.boolProps, prop) > -1) {
      return PROP_INPUT_TYPE.CHECK;
    }
    if (_.indexOf(this.CustomDataInputSettings.objProps, prop) > -1) {
      return PROP_INPUT_TYPE.OBJ;
    }
    if (_.indexOf(this.CustomDataInputSettings.objArrayProps, prop) > -1) {
      return PROP_INPUT_TYPE.OBJ_ARRAY;
    }
    return PROP_INPUT_TYPE.TEXT;
  }

  handleDateChange($event, prop) {
    this.CustomData[prop] = moment($event).format('YYYY-MM-DD');
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

export class CustomDataInputSettings {
  numProps = [];
  dateProps = [];
  tagProps = [];
  boolProps = [];
  objProps = [];
  objArrayProps = [];
  omitProps = [];
  enumProps = [];
  enums = null;

  constructor(data: CustomDataInputSettings) {
    if (data) {
      for (let property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
}
