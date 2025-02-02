<?php

require_once(join('/', [__DIR__, 'i18n.php']));

class RouterView {
  public string $preferredLanguage;
  public string $lang;
  public ?string $layoutDataPath;
  public string $templatePath;
  public string $dataPath;
  public string $stylePath;
  public string $scriptPath;
}

// / -> fr, views/_index/root.view.php
// /fr -> fr, views/_index/root.view.php
// /fr/ -> fr, views/_index/root.view.php
// /en -> en, views/_index/root.view.php
// /en/ -> en, views/_index/root.view.php
// /foobar -> fr, views/foobar/_index/foobar.view.php
// /foobar/ -> fr, views/foobar/_index/foobar.view.php
// /fr/foobar -> en, views/foobar/_index/foobar.view.php
// /fr/foobar/ -> en, views/foobar/_index/foobar.view.php
// /en/foobar -> en, views/foobar/_index/foobar.view.php
// /en/foobar/ -> en, views/foobar/_index/foobar.view.php
function routerGetView($getViewFunc): RouterView {
  $preferredLanguage = getPreferredLanguage($_SERVER['HTTP_ACCEPT_LANGUAGE']);
  $pageLang = $preferredLanguage;
  $requestUri = $_SERVER['REQUEST_URI'];
  if (str_starts_with($requestUri, '/fr')) {
    $requestUri = substr($requestUri, 3);
    $pageLang = 'fr';
  } else if (str_starts_with($requestUri, '/en')) {
    $requestUri = substr($requestUri, 3);
    $pageLang = 'en';
  }

  // prepend / if not present
  if (!str_starts_with($requestUri, '/')) {
    $requestUri = "/$requestUri";
  }
  // remove trailing / is any
  if (str_ends_with($requestUri, '/') && strlen($requestUri) > 1) {
    $requestUri = substr($requestUri, 0, -1);
  }

  $viewFolder = '_404';
  $viewName = '_404';
  if ($requestUri === '/') {
    $viewFolder = '';
    $viewName = 'root';
  } else {
    $getViewRes = $getViewFunc($requestUri);
    if ($getViewRes !== null) {
      $viewFolder = $getViewRes['folder'];
      $viewName = $getViewRes['name'];
    }
  }

  $viewDataPath = "views/$viewFolder/_index/$viewName.view.php";
  $viewTemplatePath = "views/$viewFolder/_index/$viewName.view.tpl";
  $viewStylePath = "views/$viewFolder/_index/$viewName.view.css";
  $viewScriptPath = "views/$viewFolder/_index/$viewName.view.js";

  if (!file_exists($viewTemplatePath)) {
    $viewDataPath = "views/_404/_index/_404.view.php";
    $viewTemplatePath = "views/_404/_index/_404.view.tpl";
    $viewStylePath = "views/_404/_index/_404.view.css";
    $viewScriptPath = "views/_404/_index/_404.view.js";
  }

  // parse the template file to find the layout name
  // considering the smarty syntax to extend the layout
  // {extends '../relative/path/to/<name>.layout.tpl'} -> extract the <name>
  $layoutPhpPath = null;
  $templateContent = file_get_contents($viewTemplatePath);
  preg_match('/\{extends .+\/([a-z-]+\.layout\.tpl).+\}/', $templateContent, $matches);
  if (count($matches) > 1) {
    $extendsName = trim($matches[1]);
    if (str_ends_with($extendsName, '.layout.tpl')) {
      $layoutName = rtrim($extendsName, '.layout.tpl');
      $layoutPhpPath = "layouts/$layoutName/$layoutName.layout.php";
    }
  }

  $routerView = new RouterView();
  $routerView->preferredLanguage = $preferredLanguage;
  $routerView->lang = $pageLang;
  $routerView->layoutDataPath = $layoutPhpPath;
  $routerView->templatePath = $viewTemplatePath;
  $routerView->dataPath = $viewDataPath;
  $routerView->stylePath = $viewStylePath;
  $routerView->scriptPath = $viewScriptPath;
  return $routerView;
}1

?>
