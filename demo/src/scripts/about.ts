import { test } from './utils';

export class About {
  public constructor() {
    console.log('about');
    console.log(test());

    const div = document.getElementById('filled-with-script');
    if (div !== null) {
      div.innerText = 'This is content from script';
    }
  }
}

const script = new About();
(window as any).script = script;
