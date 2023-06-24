import { Config } from '../models/config.js';
import { I18N } from '../models/i18n.js';

export interface ProcessContext {
  config: Config;
  i18n: I18N;
  lang: string;
}
