import { IonTextItem } from './ion-text-item';

export interface IonDateTimeConfig {
  inputLabel: IonTextItem;
  placeholder?: string;
  inputName?: string;
  displayFormat?: string;
  pickerFormat?: string;
  inputClasses?: string;
  min?: string | Date;
  max?: string | Date;
  pickerOptions?: any;
  disabled?: boolean;
}
