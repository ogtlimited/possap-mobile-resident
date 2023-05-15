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

  formProcessor(obj) {
    const { formSchema, name } = obj;
    console.log(formSchema, name);
    const endpoint = this.getEndpoint(name);

    this.reqS.get(endpoint).subscribe((data) => {
      if (name === 'POLICE EXTRACT') {
        this.pEFormSchema(data, formSchema);
      } else if (name === 'POLICE CHARACTER CERTIFICATE') {
        this.pccFormSchema(data, formSchema);
      }
    });
  }

  async pccFormSchema(data, formSchema) {
    console.log(data);
    const { ResponseObject } = data;
    const { CharacterCertificateReasonsForInquiry, Countries, RequestTypes } =
      ResponseObject;
    console.log(CharacterCertificateReasonsForInquiry);
    // console.log(ExtractCategories.slice(0, 2));
    const transform = formSchema.map((e: any) => {
      if (e.name === 'CharacterCertificateReasonForInquiry') {
        const item = {
          ...e,
          options: CharacterCertificateReasonsForInquiry.map((c) => ({
            key: c.Id.toString(),
            value: c.Name,
          })),
        };
        return item;
      } else if (e.name === 'RequestType') {
        const item = {
          ...e,
          options: RequestTypes.map((c) => ({
            key: c.Id.toString(),
            value: c.Name,
          })),
        };

        return item;
      } else if (
        e.name === 'SelectedCountryOfOrigin' ||
        e.name === 'SelectedCountryOfPassport' ||
        e.name === 'DestinationCountry'
      ) {
        const item = {
          ...e,
          options: Countries.map((c) => ({
            key: c.Id.toString(),
            value: c.Name,
          })),
        };

        return item;
      }
      return e;
    });
    console.log(transform);
    this.formObject$.next(transform);
  }
  async pEFormSchema(data, formSchema) {
    console.log(data);
    const { ResponseObject } = data;
    const { ExtractCategories } = ResponseObject;
    console.log(ExtractCategories);
    // console.log(ExtractCategories.slice(0, 2));
    const subCategories = ExtractCategories.map((sub) =>
      this.formatExtractOptions(sub)
    );
    const transform = formSchema.map((e: any) => {
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

  getEndpoint(name) {
    if (name === 'POLICE EXTRACT') {
      return baseEndpoints.extractFormdata;
    } else if (name === 'POLICE CHARACTER CERTIFICATE') {
      return baseEndpoints.pccFormdata;
    }
  }
}
