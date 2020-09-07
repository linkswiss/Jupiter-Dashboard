import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export class FormGroupTyped<T> extends FormGroup {
  readonly value: T;
  readonly valueChanges: Observable<T>;

  constructor(controls: { [key in keyof T]?: AbstractControl; },
              validatorOrOpts?: ValidatorFn | Array<ValidatorFn> | AbstractControlOptions | null,
              asyncValidator?: AsyncValidatorFn | Array<AsyncValidatorFn> | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  patchValue(value: Partial<T> | T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    super.patchValue(value, options);
  }

  get(path: Array<Extract<keyof T, string>> | Extract<keyof T, string>): AbstractControl | never {
    return super.get(path);
  }
}
//
// // EXAMPLE USAGE:
// //
// // export class SearchModel {
// //   criteria: string;
// // }
// //
// // const searchForm = new FormGroupTyped<SearchModel >({
// //   criteria: new FormControl('', Validators.required) // OK
// //   badBoy: new FormControl('', Validators.required)  // TS2345: Object literal may only specify known properties, and 'badBoy' does not exist in type '{ criteria: AbstractControl; }'.
// // });


