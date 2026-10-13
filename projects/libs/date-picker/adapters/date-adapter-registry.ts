import { inject, Injectable } from '@angular/core';
import { DateAdapterRegistration } from './consts';
import { GregorianAdapter } from './locales/gregorian.adapter';
import { DATE_ADAPTERS } from '../tokens/adapters';

@Injectable()
export class DateAdapterRegistry {
  adapters = inject<DateAdapterRegistration[]>(DATE_ADAPTERS);

  resolve(locale: string) {
    const type = this.adapters?.find((x) => x.locale == locale)?.useClass;
    if (!type) {
      console.warn(`Date adapter "${locale}" not registred!`);
      return new GregorianAdapter();
    } else {
      return new type();
    }
  }
}
