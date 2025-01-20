export interface CompileScssPort {
  compile(inputPath: string): Promise<string>;
}
