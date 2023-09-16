/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function DateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const today = new Date();
    const startDate = new Date(control.value);

    return startDate < today ? { dateValid: true } : null;
  };
}

export function EndDateValidator(val): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const today = new Date();
    const startDate = new Date(control.value);

    return startDate < today ? { dateValid: true } : null;
  };
}
