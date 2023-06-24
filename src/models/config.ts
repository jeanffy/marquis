export const I18N_TAG = '$m.i18n';
export const LANG_TAG = '$m.lang';
export const URL_PAGE_TAG = '$m.url.page';
export const URL_LANG_TAG = '$m.url.lang';
export const URL_ASSET_TAG = '$m.url.asset';
export const STYLE_TAG = '$m.page.style';
export const SCRIPT_TAG = '$m.page.script';

export const INPUT_TEMPLATE_NAME_SUFFIX = 'template.php';
export const INPUT_STYLE_NAME_SUFFIX = 'style.scss';
export const INPUT_SCRIPT_NAME_SUFFIX = 'script.js';

export const OUTPUT_HTACCESS_NAME = '.htaccess';

// interface for user configuration through .marquis.yml
export interface Config {
  i18n: {
    inputLangsDir: string;
    availableLanguages: string[];
    defaultLang: string;
    invisibleDefaultLang: boolean; // invisible = not present in URL for the default language
  };
  pages: {
    outputPagesFolderName: string;
    inputPagesDir: string;
    defaultPage: string;
    invisibleDefaultPage: boolean; // invisible = not present in URL for the default page
  };
  assets: {
    outputAssetsFolderName: string;
    inputAssetsDir: string;
    outputAssetsDir: string;
  };
  output: {
    rootOutputDir: string;
  };
}
