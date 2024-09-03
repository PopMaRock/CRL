declare module 'american-british-english-translator' {
    export class Translator {
      static translate(text: string, options: { British: boolean }): string;
    }
  }