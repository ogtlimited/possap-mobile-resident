import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbrev',
})
export class AbbrevPipe implements PipeTransform {
  transform(value: string): string {
    console.log(value);
    return value.match(/\b([A-Z])/g).join('');;
  }
}
