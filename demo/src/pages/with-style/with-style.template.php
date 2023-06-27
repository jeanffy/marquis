{% extends '../../common/twig/_skeleton.twig' %}
{% block content %}

<h1>$m.i18n(withStyle.title)</h1>

<p>
  $m.i18n(withStyle.description)
</p>

<p class="red">
  $m.i18n(withStyle.textStyled)
</p>

{% endblock %}
