import { IonTextItem } from './ion-text-item';

export interface IonSelectConfig {
  inputLabel: IonTextItem;
  multiple?: boolean;
  idKey?: string;
  labelKey?: string;
  alertOptions?: any;
  forceListItems: boolean;
  placeholder?: string;
  disabled?: boolean;
}
