{% extends '../../common/twig/_skeleton.twig' %}
{% block content %}

<h1>$m.i18n(home.title)</h1>

<p>
  $m.i18n(home.description)
</p>

<p>
  <script src="../../common/js/utils.js"></script>
  <script>
    document.write(getSomething())
  </script>
</p>

<p>
  <?php
  require_once('../../common/php/utils.php');
  echo getSomething();
  ?>
</p>

<p>
  $m.i18n(home.imageBelow)
</p>
<p>
  <img src="$m.url.asset(img/sample-image.jpg)"/>
</p>

{% endblock %}
