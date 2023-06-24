{% extends '../_skeleton.twig' %}
{% block content %}

<h1>$m.i18n(home.title)</h1>

<p>
  This page is the default one, and this does not appear in the URL.
</p>

<p>
  Below is an image loaded from assets:
</p>
<p>
  <img src="$m.url.asset(img/sample-image.jpg)"/>
</p>

{% endblock %}
