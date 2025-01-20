<?php

$autoloadPath = join('/', [$_SERVER['DOCUMENT_ROOT'], 'APP_BASE_URL', 'vendor/autoload.php']);
if (file_exists($autoloadPath)) {
  require_once($autoloadPath);
}

require_once(join('/', [__DIR__, 'router.php']));
require_once(join('/', [__DIR__, 'i18n.php']));

function renderView($getViewFunc) {
  $view = routerGetView($getViewFunc);

  initializeI18N($view->lang);

  $smarty = new Smarty();

  $smarty->registerPlugin(Smarty::PLUGIN_MODIFIER, 'tr', function($key) use ($view) {
    return translateI18N($key);
  });

  $smarty->registerPlugin(Smarty::PLUGIN_FUNCTION, 'switchLangUrl', function($params) use ($view) {
    extract($params);
    echo getSwitchUrl($view, empty($lang) ? 'en' : $lang);
  });

  $smarty->registerPlugin(Smarty::PLUGIN_FUNCTION, 'viewHead', function($params) use ($view) {
    extract($params);
    if (empty($baseUrl)) {
      $baseUrl = '';
    }
    if (file_exists(join('/', [$_SERVER['DOCUMENT_ROOT'], $view->stylePath]))) {
      echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"$baseUrl/$view->stylePath\"/>";
    }
  });

  $smarty->registerPlugin(Smarty::PLUGIN_FUNCTION, 'viewScript', function($params) use ($view) {
    extract($params);
    if (empty($baseUrl)) {
      $baseUrl = '';
    }
    if (file_exists(join('/', [$_SERVER['DOCUMENT_ROOT'], $view->scriptPath]))) {
      echo "<script src=\"$baseUrl/$view->scriptPath\"></script>";
    }
  });

  $smarty->registerPlugin(Smarty::PLUGIN_FUNCTION, 'navigate', function($params) use ($view) {
    extract($params);
    if (empty($baseUrl)) {
      $baseUrl = '';
    }
    if (!empty($url)) {
      if ($view->lang == $view->preferredLanguage) {
        echo "$baseUrl/$url";
      } else {
        echo "$baseUrl/$view->lang/$url";
      }
    } else {
      if ($view->lang == $view->preferredLanguage) {
        echo "$baseUrl/";
      } else {
        echo "$baseUrl/$view->lang";
      }
    }
  });

  $smarty->assign([
    'pageLang' => $view->lang,
  ]);

  if ($view->layoutDataPath != null) {
    $viewLayoutDataPath = join('/', [$_SERVER['DOCUMENT_ROOT'], $view->layoutDataPath]);
    if (file_exists($viewLayoutDataPath)) {
      $viewData = require_once($viewLayoutDataPath);
      $smarty->assign($viewData);
    }
  }

  $viewDataPath = join('/', [$_SERVER['DOCUMENT_ROOT'], $view->dataPath]);
  if (file_exists($viewDataPath)) {
    $viewData = require_once($viewDataPath);
    $smarty->assign($viewData);
  }

  $viewTemplatePath = join('/', [$_SERVER['DOCUMENT_ROOT'], $view->templatePath]);
  $smarty->display($viewTemplatePath);
}

?>
