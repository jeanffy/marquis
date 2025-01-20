export interface CompileTsPort {
  compile(inputPath: string): Promise<string>;
}
