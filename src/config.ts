export interface MarquisConfigScripts {
  dir?: string;
  typeRoots?: string[];
  excludes?: string[];
}

export interface MarquisConfigPages {
  dir: string;
  default: string;
  excludes?: string[];
  ext?: string;
}

export interface MarquisConfigAdditionalFileConf {
  src: string;
  dst: string;
}

export interface MarquisConfigStyles {
  dir?: string;
  excludes?: string[];
}

export interface MarquisConfigAssets {
  dir: string;
}

export interface MarquisConfig {
  outputDir?: string;
  pages: MarquisConfigPages;
  styles?: MarquisConfigStyles;
  scripts?: MarquisConfigScripts;
  assets?: MarquisConfigAssets;
  additionalFiles?: (string | MarquisConfigAdditionalFileConf)[];
}
