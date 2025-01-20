export class FakeCompileScssAdapter {
    fsPort;
    constructor(fsPort) {
        this.fsPort = fsPort;
    }
    async compile(inputPath) {
        const scssContent = await this.fsPort.readFile(inputPath);
        return scssContent;
    }
}
//# sourceMappingURL=fake-compile-scss.adapter.js.map