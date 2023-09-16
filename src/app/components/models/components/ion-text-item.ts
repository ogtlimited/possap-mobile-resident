export interface IonTextItem {
  [ x: string ]: string;
  slot?: string;
  classes?: string;
  routerLink?: any;
  text: string;
  additionalText?: string;
  prefix?: string;
  suffix?: string;
  color?: string;
}
