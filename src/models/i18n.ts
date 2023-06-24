// interface for i18n files (fr.yml, en.yml, etc.)
export interface I18N {
  [k: string]: string | I18N;
}
