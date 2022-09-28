export interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: boolean;
  maxLength?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}

export interface JsonFormControlOptions {
  min?: string;
  max?: string;
  step?: string;
  icon?: string;
}
export interface JsonFormControlSelectOptions {
  key?: string;
  value?: string;
}
export interface JsonFormControlRadioOptions {
  label?: string;
  value?: string;
}
export interface JsonFormControlShowIf {
  equals?: string;
  value?: string;
}

export interface JsonFormControls {
  name: string;
  label: string;
  value: string;
  placeholder: string;
  type: string;
  showIf?: JsonFormControlShowIf;
  rangeoptions?: JsonFormControlOptions;
  options?: JsonFormControlSelectOptions[];
  radioOptions: JsonFormControlRadioOptions[];
  config: {
    multiple: boolean;
  };
  required: boolean;
  validators: JsonFormValidators;
  api: {
    body?: any;
    path: string;
  };
}

export interface JsonFormData {
  controls: JsonFormControls[];
}
