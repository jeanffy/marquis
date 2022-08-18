<html>
<head>
  <!-- #marquis:styles -->
</head>
<body>

<p>
  <a href="home">Home</a> | <a href="about">About</a> | <a href="contact">Contact</a>
</p>

<h1>This is the about page</h1>

<p>This page is simple raw PHP, without twig template</p>

<?php
require_once('_utils.php');
echo getStringFromPHP();
?>

<div id="filled-with-script"></div>

<p>
  <img src="../assets/img/sample-image.jpg"/>
</p>

<div class="some-class">
  This text is stylized with CSS
</div>

<!-- #marquis:scripts -->

</html>
