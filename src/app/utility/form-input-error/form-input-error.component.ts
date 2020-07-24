import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { isBoolean } from 'util';

@Component({
  selector: 'jupiter-form-input-error',
  templateUrl: './form-input-error.component.html',
  styleUrls: ['./form-input-error.component.scss'],
})
export class FormInputErrorComponent {
  @Input() control: FormControl;

  constructor() {
  }

  getErrorMessage(): Array<string> {
    let errors = new Array<string>();

    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName)) {
        if (propertyName === 'required') {
          errors.push(_.startCase(propertyName));
        } else if (isBoolean(this.control.errors[propertyName])) {
          errors.push(`Invalid ${_.startCase(propertyName)}`);
        } else {
          let error = `Invalid ${_.startCase(propertyName)} - `;
          for (let propErrorName in this.control.errors[propertyName]) {
            if (this.control.errors[propertyName].hasOwnProperty(propErrorName) && propErrorName !== 'actualLength') {
              error += `${_.startCase(propErrorName)}: ${this.control.errors[propertyName][propErrorName]} `;
            }
          }
          errors.push(error);
        }
      }
      // let errors = _.startCase(propertyName);
      // return _.startCase(propertyName);
      // if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
      //
      //   let error = this.control.errors[propertyName];
      //
      //   return _.startCase(error);
      // }
      // {
      return errors;
      // }
    }
    // return null;
  }


}
