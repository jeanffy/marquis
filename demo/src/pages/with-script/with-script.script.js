console.log('$m.i18n(withScript.scriptLoadMessage)');

function onChangeColorClicked() {
  const p = document.getElementById('text-to-change');
  if (p !== null) {
    p.style.color = 'green';
    console.log('$m.i18n(withScript.changeColorConfirm)');
  }
}
