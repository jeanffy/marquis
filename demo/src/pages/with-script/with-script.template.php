{% extends '../_skeleton.twig' %}
{% block content %}

<h1>$m.i18n(withScript.title)</h1>

<p id="text-to-change">
  $m.i18n(withScript.description)
</p>

<button onclick="onChangeColorClicked()">$m.i18n(withScript.changeColorButton)</button>

{% endblock %}
