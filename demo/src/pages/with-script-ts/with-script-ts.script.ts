import { COMMON_TS } from '../../common/ts/common.js';

console.log(`$m.i18n(withScript.scriptLoadMessage): ${COMMON_TS}`);

export function onChangeColorClicked() {
  const p = document.getElementById('text-to-change');
  if (p !== null) {
    p.style.color = 'green';
    p.innerHTML += `<b>${COMMON_TS}</>`;
    console.log(`$m.i18n(withScript.changeColorConfirm): ${COMMON_TS}`);
  }
}

(window as any).onChangeColorClicked = onChangeColorClicked;
