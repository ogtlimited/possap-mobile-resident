import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbrev',
})
export class AbbrevPipe implements PipeTransform {
  transform(value: string): string {
    return value.match(/\b([A-Z])/g).join('');;
  }
}
