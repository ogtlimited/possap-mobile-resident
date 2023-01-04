import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nextApprovalLevel',
})
export class NextApprovalLevelPipe implements PipeTransform {
  transform(value: unknown, ...args: any[]): unknown {
    const approvalWorkFlow = args[0];
    const state = args[1];
    console.log(state);
    if (value === 'Completed') {
      return value;
    }
    const filt = approvalWorkFlow.findIndex((val) => val.id === value);
    if (state === 'next') {
      if (approvalWorkFlow[filt + 1]) {
        return approvalWorkFlow[filt + 1].name.length > 30
          ? approvalWorkFlow[filt].slice(0, 30) + '...'
          : approvalWorkFlow[filt];
      } else {
        return 'Final';
      }
    } else {
      return approvalWorkFlow[filt].name;
    }
  }
}
