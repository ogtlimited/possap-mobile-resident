import { SelectOption } from '../models/form-model';

/* eslint-disable @typescript-eslint/naming-convention */
const IndividualIdentificationTypesOption: SelectOption[] = [
  {
    value: 1,
    label: 'National Identification Number',
  },
  // {
  //   value: 2,
  //   label: 'Drivers License',
  // },
  // {
  //   value: 3,
  //   label: 'International Passport',
  // },
  // {
  //   value: 4,
  //   label: 'Bank Verification Number',
  // },
];
const CorportateIdentificationTypesOption: SelectOption[] = [
  {
    value: 5,
    label: 'Tax Identification Number',
  },
];


export {
    IndividualIdentificationTypesOption,
    CorportateIdentificationTypesOption
};
