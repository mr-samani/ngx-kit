import { GregorianAdapter } from './gregorian.adapter';
import { IDateAdapter } from './IAdapter';
import { JalaliAdapter } from './jalali-adapter';
import { Locale } from './locale';

export class CalendarAdapterFactory {
  static create(locale: Locale): IDateAdapter {
    switch (locale) {
      case 'fa':
        return new JalaliAdapter();

      case 'en':
        return new GregorianAdapter();

      //   case 'he':
      //     return new HebrewAdapter();

      //   case 'zh':
      //     return new ChineseAdapter();

      default:
        return new GregorianAdapter();
    }
  }
}
