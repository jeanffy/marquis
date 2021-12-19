import { test } from './utils';

export class Home {
  public constructor() {
    console.log('home');
    console.log(test());
  }
}

const script = new Home();
(window as any).script = script;
