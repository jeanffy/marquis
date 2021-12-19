import { test } from './utils';

export class About {
  public constructor() {
    console.log('about');
    console.log(test());
  }
}

const script = new About();
(window as any).script = script;
