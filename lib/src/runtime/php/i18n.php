<?php

$i18nValues = null;

function initializeI18N($lang) {
  global $i18nValues;
  $i18nPath = join('/', [$_SERVER['DOCUMENT_ROOT'], 'APP_BASE_URL', "i18n/$lang.json"]);
  $i18nContent = file_get_contents($i18nPath);
  $i18nValues = json_decode($i18nContent, true);
}

function translateI18N($key) {
  global $i18nValues;

  // from an associative array like ['foo' => ['bar' => 'baz']] and a key like 'foo.bar'
  // find the value ('baz' in the example), if the value is not found, just return the key as a fallback
  $subKeys = explode('.', $key);
  $arr = $i18nValues;
  foreach ($subKeys as $subKey) {
    if (isset($arr[$subKey])) {
      $arr = $arr[$subKey];
    } else {
      return $key;
    }
  }
  return $arr;
}

function getSwitchUrl($view, $nextLang) {
  $currentPath = $_SERVER['REQUEST_URI'];

  if (str_starts_with($currentPath, '/fr/') && $nextLang == 'fr') {
    return $currentPath;
  }
  if (str_starts_with($currentPath, '/en/') && $nextLang == 'en') {
    return $currentPath;
  }

  $currentPath = ltrim($currentPath, '/fr/');
  $currentPath = ltrim($currentPath, '/en/');

  $nextPath = "/$currentPath";
  if ($nextLang == $view->preferredLanguage) {
    $nextPath = "/$currentPath";
  } else {
    switch ($nextLang) {
      case 'fr': $nextPath = "/fr/$currentPath"; break;
      case 'en': $nextPath = "/en/$currentPath"; break;
    }
  }

  if (strlen($nextPath) > 1 && str_ends_with($nextPath, '/')) {
    $nextPath = substr($nextPath, 0, strlen($nextPath) - 1);
  }

  return $nextPath;
}

function getPreferredLanguage($httpAcceptLanguage) {
  // some sort of security
  if (strlen($httpAcceptLanguage) > 500) {
    return 'en';
  }
  $lang = strtolower(substr(trim($httpAcceptLanguage), 0, 2));
  if ($lang == 'fr') {
    return 'fr';
  }
  return 'en';
}

?>
