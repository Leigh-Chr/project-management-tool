import { Pipe, PipeTransform } from '@angular/core';
import translationsData from './translations.json';

type TranslationDictionary = { [key: string]: string | TranslationDictionary };

const translations = translationsData as TranslationDictionary;

@Pipe({
  name: 'translate',
})
export class TranslatorPipe implements PipeTransform {
  private supportedLocales = Object.keys(translations);

  transform(value: string, locale?: string): string {
    const browserLocale = window.navigator.language.split('-')[0];
    locale =
      locale || this.supportedLocales.find((l) => l === browserLocale) || 'en';
    if (!this.supportedLocales.includes(locale)) {
      console.warn(
        `Locale '${locale}' is not supported. Using default locale 'en'`
      );
      locale = 'en';
    }

    const keys = value.split('.');
    let translation: string | TranslationDictionary = translations[locale];

    for (const key of keys) {
      if (typeof translation === 'object' && key in translation) {
        translation = translation[key] as string | TranslationDictionary;
      } else {
        console.warn(
          `Translation for '${value}' not found in locale '${locale}'`
        );
        return value;
      }
    }

    return typeof translation === 'string' ? translation : value;
  }
}
