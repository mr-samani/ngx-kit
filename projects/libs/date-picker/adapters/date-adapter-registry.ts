import { inject, Injectable } from '@angular/core';
import { DATE_ADAPTERS, DateAdapterRegistration } from './consts';
import { GregorianAdapter } from './locales/gregorian.adapter';

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
