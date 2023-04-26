/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { baseEndpoints } from '../config/endpoints';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormProcessorService {
  formObject$: BehaviorSubject<any> = new BehaviorSubject<boolean>(null);
  constructor(private reqS: RequestService) {}

  async pEFormSchema(schema: any[]) {
    console.log(schema);

    this.reqS.get(baseEndpoints.extractFormdata).subscribe((data) => {
      console.log(schema);
      const { ResponseObject } = data;
      const { ExtractCategories } = ResponseObject;
      console.log(ExtractCategories);
      // console.log(ExtractCategories.slice(0, 2));
      const subCategories = ExtractCategories.map((sub) =>
        this.formatExtractOptions(sub)
      );
      const transform = schema.map((e: any) => {
        if (e.name === 'SelectedCategories') {
          const item = {
            ...e,
            options: ExtractCategories.map((c) => ({
              key: c.Id.toString(),
              value: c.Name,
            })),
          };
          console.log(item, 'selected cat');
          return item;
        }
        return e;
      });
      transform.splice(1, 0, ...subCategories);
      this.formObject$.next(transform);
    });
  }

  formatExtractOptions(obj) {
    console.log(obj);
    if (obj.FreeForm) {
      return {
        name: obj.Id.toString(),
        type: 'text',
        label: 'Reason for Request',
        value: '',
        showIf: {
          value: 'SelectedCategories',
          equals: obj.Id.toString(),
        },
        validators: {
          required: true,
        },
        placeholder: 'Enter your reason for extract',
      };
    }
    return {
      name: obj.Id.toString(),
      type: 'select',
      label: obj.Name,
      config: {
        multiple: true,
      },
      showIf: {
        value: 'SelectedCategories',
        equals: obj.Id.toString(),
      },
      options: this.mapSelectOptions(obj.SubCategories),
      validators: {
        required: true,
      },
      placeholder: obj.Name,
    };
  }

  mapSelectOptions(arr) {
    console.log(arr);
    return arr.map((s) => ({
      key: s.Id.toString(),
      value: s.Name,
    }));
  }
}
