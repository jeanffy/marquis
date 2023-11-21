console.log(`$m.i18n(withScript.scriptLoadMessage): from JS`);

function onChangeColorClicked() {
  const p = document.getElementById('text-to-change');
  if (p !== null) {
    p.style.color = 'green';
    p.innerHTML += `<b>From JS</>`;
    console.log(`$m.i18n(withScript.changeColorConfirm): From JS`);
  }
}
